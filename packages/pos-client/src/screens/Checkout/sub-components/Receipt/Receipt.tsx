import { Database, Q } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import withObservables from '@nozbe/with-observables';
import dayjs from 'dayjs';
import { flatten } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Loading } from '../../../../components/Loading/Loading';
import { TimePicker } from '../../../../components/TimePicker/TimePicker';
import { OrganizationContext } from '../../../../contexts/OrganizationContext';
import { ReceiptPrinterContext } from '../../../../contexts/ReceiptPrinterContext';
import { Button, Col, Grid, Icon, Row, Text } from '../../../../core';
import {
  Bill,
  BillDiscount,
  BillPayment,
  Discount,
  PaymentType,
  PriceGroup,
  Printer,
  tableNames,
} from '../../../../models';
import { BillItem } from '../../../../models/BillItem';
import { PrintStatus } from '../../../../models/BillItemPrintLog';
import { kitchenReceipt } from '../../../../services/printer/kitchenReceipt';
import { print } from '../../../../services/printer/printer';
import { receiptBill } from '../../../../services/printer/receiptBill';
import { Fonts } from '../../../../theme';
import { formatNumber, minimalBillSummary, MinimalBillSummary } from '../../../../utils';
import { ReceiptItems } from './ReceiptItems';

interface ReceiptInnerProps {
  billPayments: BillPayment[];
  billDiscounts: BillDiscount[];
  chargableBillItems: BillItem[];
  discounts: Discount[];
  billModifierItemsCount: number;
  itemsRequiringPrepTimeCount: number;
  priceGroups: PriceGroup[];
}

interface ReceiptOuterProps {
  onStore?: () => void;
  onCheckout?: () => void;
  bill: Bill;
  database: Database;
  complete: boolean;
}

export const ReceiptInner: React.FC<ReceiptOuterProps & ReceiptInnerProps> = ({
  bill,
  chargableBillItems,
  billDiscounts,
  billPayments,
  onStore,
  onCheckout,
  complete,
  discounts,
  itemsRequiringPrepTimeCount,
  billModifierItemsCount,
  priceGroups,
}) => {
  const [summary, setSummary] = useState<MinimalBillSummary>();
  const database = useDatabase();
  const { organization } = useContext(OrganizationContext);
  const { receiptPrinter } = useContext(ReceiptPrinterContext);
  const { currency } = organization;
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const handleOnStore = async () => {
    // check if a prep time is required and set
    const priceGroups = await bill.assignedPriceGroups.fetch();

    if (priceGroups.some(priceGroup => priceGroup.isPrepTimeRequired) && !bill.prepAt) {
      return setIsDatePickerVisible(true);
    }

    onStore();

    // fetch all the print logs to print
    const billItemsPrintLogs = await bill.toPrintBillLogs.fetch();

    if (billItemsPrintLogs.length > 0) {
      // updates the status of the print records to processing
      const updates = billItemsPrintLogs.map(billItemPrintLog => ({
        billItemPrintLog,
        status: PrintStatus.processing,
      }));
      await database.action(() => bill.processPrintLogs(updates));

      // filter items not being printed and generate print commands
      const ids = billItemsPrintLogs.map(log => log.billItemId);

      // fetch all the bill items associated with the print logs, the printers, and the price groups.
      const [billItems, printers, priceGroups] = await Promise.all([
        database.collections
          .get<BillItem>(tableNames.billItems)
          .query(Q.where('id', Q.oneOf(ids)))
          .fetch(),
        database.collections
          .get<Printer>(tableNames.printers)
          .query()
          .fetch(),
        database.collections
          .get<PriceGroup>(tableNames.priceGroups)
          .query()
          .fetch(),
      ]);

      // this will generate the print commands to fire off to all the printers.
      const toPrint = await kitchenReceipt({
        billItems,
        billItemPrintLogs: billItemsPrintLogs,
        printers,
        priceGroups,
        reference: bill.reference.toString(),
        prepTime: dayjs().add(10, 'minute'), // TODO: set prep time
      });

      // attempt to print the receipts
      const printStatuses = await Promise.all(
        toPrint.map(async ({ billItemPrintLogs, printer, commands }) => {
          const res = await print(commands, printer, false);
          const status = res.success ? PrintStatus.succeeded : PrintStatus.errored;

          return billItemPrintLogs.map(billItemPrintLog => {
            return {
              billItemPrintLog,
              status,
            };
          });
        }),
      );

      await database.action(() => bill.processPrintLogs(flatten(printStatuses)));
    }

    await database.action(bill.storeBill);
  };

  useEffect(() => {
    const summary = async () => {
      const summary = await minimalBillSummary({
        chargableBillItems,
        billDiscounts,
        billPayments,
        discounts,
        database,
      });
      setSummary(summary);
    };
    summary();
  }, [chargableBillItems, billDiscounts, billPayments, billModifierItemsCount]);

  const onPrint = async () => {
    const [billItems, paymentTypes, priceGroups] = await Promise.all([
      bill.billItemsExclVoids.fetch(), // include comps - receipts will show comps but not voids
      database.collections
        .get<PaymentType>(tableNames.paymentTypes)
        .query()
        .fetch(),
      database.collections
        .get<PriceGroup>(tableNames.priceGroups)
        .query()
        .fetch(),
    ]);

    const commands = await receiptBill(
      billItems,
      billDiscounts,
      billPayments,
      discounts,
      priceGroups,
      paymentTypes,
      receiptPrinter,
      organization,
    );

    print(commands, receiptPrinter, false);
  };

  const handleSetPrepTime = async (date: Date) => {
    // dont allow the user to selcet a time in the past
    console.log('date', date);
    console.log('dayjs(date)', dayjs(date));
    console.log('dayjs()', dayjs(new Date()));
    if (dayjs(date).isBefore(dayjs())) {
      return;
    }

    await database.action(() =>
      bill.update(record => {
        record.prepAt = date;
      }),
    );
    setIsDatePickerVisible(false);
    handleOnStore();
  };

  const handleCancelPrepTimeModal = () => {
    setIsDatePickerVisible(false);
  };

  if (!bill || !summary) {
    return <Loading />;
  }

  const { totalDiscount, total, totalPayable, balance } = summary;
  const requiresPrepTime =
    priceGroups.some(priceGroup => priceGroup.isPrepTimeRequired) && itemsRequiringPrepTimeCount > 0;
  const dateString = bill.prepAt ? dayjs(bill.prepAt).format('HH:mm') : '';
  console.log('bill', bill);
  return (
    <Grid style={styles.grid}>
      <Row style={styles.r1}>
        {/* <Col style={{ backgroundColor: 'whitesmoke' }}></Col> */}
        <Col>
          <Text style={styles.dateText}>
            {dayjs(bill.createdAt)
              .format('DD/MM/YYYY HH:mm')
              .toString()}
          </Text>
        </Col>
      </Row>
      <Row style={{ height: 45 }}>
        <Col>
          <Button full info onPress={onStore}>
            <Text style={{ fontWeight: 'bold' }}>Bill: {bill.reference || '-'}</Text>
          </Button>
        </Col>
        <Col>
          <Button full warning>
            <Text style={{ fontWeight: 'bold' }}>{`Prep for: ${dateString}`}</Text>
          </Button>
        </Col>
      </Row>
      <Row style={styles.r2}>
        <ReceiptItems
          bill={bill}
          readonly={complete}
          discountBreakdown={summary.discountBreakdown}
          billPayments={billPayments}
          billDiscounts={billDiscounts}
        />
      </Row>
      <Row style={styles.r3}>
        <Text>{`Discount: ${formatNumber(0 - totalDiscount, currency)}`}</Text>

        <Text>{`Total: ${formatNumber(total, currency)}`}</Text>
        {complete && (
          <Text>{`Change Due: ${formatNumber(
            Math.abs(billPayments.find(payment => payment.isChange).amount),
            currency,
          )}`}</Text>
        )}
        <Text style={Fonts.h3}>{`Balance: ${formatNumber(balance, currency)}`}</Text>
      </Row>
      <Row style={styles.r4}>
        <Button disabled={!receiptPrinter} info iconLeft full style={{ flexGrow: 1 }} onPress={onPrint}>
          <Icon name="ios-print" />
          <Text>Print</Text>
        </Button>
      </Row>
      {!complete && (
        <Row style={styles.r5}>
          <Col>
            <Button block iconLeft onPress={handleOnStore} full style={{ height: '100%' }}>
              <Icon name="ios-save" />
              <Text>Store</Text>
            </Button>
          </Col>
          <Col>
            <Button full success onPress={onCheckout} iconLeft style={{ height: '100%' }}>
              <Icon name="ios-cart" />
              <Text>Checkout</Text>
            </Button>
          </Col>
        </Row>
      )}
      <TimePicker
        isVisible={isDatePickerVisible}
        onCancel={handleCancelPrepTimeModal}
        onConfirm={handleSetPrepTime}
        value={bill.prepAt}
        title="Please select a preperation time"
      />
    </Grid>
  );
};

const enhance = component =>
  withDatabase<any>(
    withObservables<ReceiptOuterProps, ReceiptInnerProps>(['bill'], ({ bill, database }) => ({
      bill,
      billPayments: bill.billPayments,
      billDiscounts: bill.billDiscounts,
      itemsRequiringPrepTimeCount: bill.itemsRequiringPrepTimeCount,
      chargableBillItems: bill.chargableBillItems, // include any items that are send to the kitchen
      discounts: database.collections.get<Discount>(tableNames.discounts).query(),
      priceGroups: bill.priceGroups.observeWithColumns(['isPrepTimeRequired']),
      /**
       * billModifierItems is here purely to cause a re render and recalculation of the
       * bill summary
       */
      billModifierItemsCount: bill.billModifierItems.observeCount(),
    }))(component),
  );

export const Receipt = enhance(ReceiptInner);

const styles = StyleSheet.create({
  grid: {
    borderLeftWidth: 1,
    borderLeftColor: 'lightgrey',
  },
  r1: {
    height: 40,
  },
  r2: {
    // height: 45,
  },
  r3: {
    borderTopColor: 'lightgrey',
    borderTopWidth: 1,
    height: 110,
    flexDirection: 'column',
    padding: 10,
    // flexGrow: 1,
  },
  r4: {
    height: 45,
  },
  r5: {
    height: 60,
  },
  printButton: {
    height: '100%',
    width: '100%',
    textAlign: 'center',
  },
  dateText: {
    textAlign: 'center',
    lineHeight: 45,
    backgroundColor: 'whitesmoke',
  },
});

import React, { useState, useEffect, useContext } from 'react';
import { Text, Col, Grid, Row, Button, Icon } from '../../../../core';
import { StyleSheet } from 'react-native';
import { formatNumber, billSummary, BillSummary, minimalBillSummary, MinimalBillSummary } from '../../../../utils';
import { Fonts } from '../../../../theme';
import { ReceiptItems } from './ReceiptItems';
import dayjs from 'dayjs';
import { print } from '../../../../services/printer/printer';
import { receiptBill } from '../../../../services/printer/receiptBill';
import withObservables from '@nozbe/with-observables';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import {
  tableNames,
  Discount,
  PaymentType,
  PriceGroup,
  Bill,
  Printer,
  BillPayment,
  BillDiscount,
  BillItemModifierItem,
} from '../../../../models';
import { Database, Q } from '@nozbe/watermelondb';
import { BillItem } from '../../../../models/BillItem';
import { kitchenReceipt } from '../../../../services/printer/kitchenReceipt';
import { flatten, groupBy } from 'lodash';
import { Loading } from '../../../../components/Loading/Loading';
import { OrganizationContext } from '../../../../contexts/OrganizationContext';
import { BillItemPrintLog, PrintStatus } from '../../../../models/BillItemPrintLog';
import { database } from '../../../../database';
import { ReceiptPrinterContext } from '../../../../contexts/ReceiptPrinterContext';
import { useDatabase } from '@nozbe/watermelondb/hooks';

// TODO: type these
interface ReceiptInnerProps {
  billPayments: BillPayment[];
  billDiscounts: BillDiscount[];
  chargableBillItems: BillItem[];
  discounts: Discount[];
  billModifierItemsCount: number;
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
  billModifierItemsCount,
}) => {
  const [summary, setSummary] = useState<MinimalBillSummary>();
  const database = useDatabase();
  const { organization } = useContext(OrganizationContext);
  const { receiptPrinter } = useContext(ReceiptPrinterContext);
  const { currency } = organization;

  const _onStore = async () => {
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
      // const filteredBillItems = billItems.filter(billItem => ids.includes(billItem.id));

      // this will generate the print commands to fire off to all the printers.
      const toPrint = await kitchenReceipt({
        billItems,
        billItemPrintLogs: billItemsPrintLogs,
        printers,
        priceGroups,
        reference: bill.reference.toString(),
        prepTime: dayjs().add(10, 'minute'), // TODO: set prep time
      });

      console.log('-------- toPrint', toPrint);
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
      await database.action(async () => {
        await bill.processPrintLogs(flatten(printStatuses));
      });
    }

    // is_stored is not set on removed items to distinguish between cancelled and voided items
    const billItemsToStore = await bill.billItems
      .extend(Q.and(Q.where('is_voided', Q.notEq(true))), Q.where('is_stored', Q.notEq(true)))
      .fetch();

    // update on all bill records, dont set voided items to stored. TODO: look at refactoring this so not using is_stored to determine.
    const billItemsToUpdate = billItemsToStore.map(billItem => {
      billItem.prepareUpdate(record => {
        record.isStored = true;
      });
    });

    await database.action(async () => {
      await database.batch(...billItemsToUpdate);
    });
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

  if (!bill || !summary) {
    return <Loading />;
  }

  const { totalDiscount, totalPayable, balance } = summary;

  return (
    <Grid style={styles.grid}>
      <Row style={styles.r1}>
        <Col style={{ backgroundColor: 'whitesmoke' }}>
          <Button style={{ margin: 5, alignSelf: 'flex-start' }} small bordered info onPress={onStore}>
            <Text style={{ fontWeight: 'bold' }}>Bill / Table: {bill.reference || '-'}</Text>
          </Button>
        </Col>
        <Col>
          <Text style={styles.dateText}>
            {dayjs(bill.createdAt)
              .format('DD/MM/YYYY HH:mm')
              .toString()}
          </Text>
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
        <Text>{`Discount: ${formatNumber(totalDiscount, currency)}`}</Text>

        <Text>{`Total: ${formatNumber(totalPayable, currency)}`}</Text>
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
            <Button block iconLeft onPress={_onStore} full style={{ height: '100%' }}>
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
    </Grid>
  );
};

const enhance = component =>
  withDatabase<any>(
    withObservables<ReceiptOuterProps, ReceiptInnerProps>(['bill'], ({ bill, database }) => ({
      bill,
      billPayments: bill.billPayments,
      billDiscounts: bill.billDiscounts,
      chargableBillItems: bill.chargableBillItems, // TODO: should this be no voids too?
      discounts: database.collections.get<Discount>(tableNames.discounts).query(),
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
    // flexGrow: 1,
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

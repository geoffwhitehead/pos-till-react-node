import React, { useState, useEffect } from 'react';
import { Text, Col, Grid, Row, Button } from '../../../../core';
import { StyleSheet } from 'react-native';
import { formatNumber, billSummary, BillSummary } from '../../../../utils';
import { Fonts } from '../../../../theme';
import { ReceiptItems } from './ReceiptItems';
import dayjs from 'dayjs';
import { print } from '../../../../services/printer/printer';
import { receiptBill } from '../../../../services/printer/receiptBill';
import withObservables from '@nozbe/with-observables';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { tableNames, Discount, PaymentType, PriceGroup, Bill, Printer } from '../../../../models';
import { Database, tableName } from '@nozbe/watermelondb';
import { PrintStatus, BillItem } from '../../../../models/BillItem';
import { kitchenReceipt } from '../../../../services/printer/kitchenReceipt';
import { flatten, pickBy } from 'lodash';
import { database } from '../../../../database';
import { Loading } from '../../../../components/Loading/Loading';

// TODO: move into org and fetch from db or something
const currencySymbol = '£';

// TODO: type these
interface ReceiptInnerProps {
  billPayments: any[];
  billDiscounts: any[];
  billItems: any[];
  billItemsIncPendingVoids: any[];
  discounts: any[];
  paymentTypes: any[];
  priceGroups: any[];
  billModifierItems: any[];
  printers: any[];
  database: Database;
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
  billItems,
  billItemsIncPendingVoids,
  billDiscounts,
  billPayments,
  onStore,
  onCheckout,
  complete,
  discounts,
  paymentTypes,
  priceGroups,
  billModifierItems,
  printers,
  database,
}) => {
  const [summary, setSummary] = useState<BillSummary>();

  const [isStoreDisabled, setIsStoreDisabled] = useState(false);
  const _onStore = async () => {
    setIsStoreDisabled(true);
    const billItemsToPrint = billItemsIncPendingVoids.filter(
      ({ printStatus }) => !(printStatus === 'success' || printStatus === 'pending' || printStatus === 'void_pending'),
    ) as BillItem[];

    if (billItemsToPrint.length) {
      await database.action(
        async () =>
          await database.batch(
            ...billItemsToPrint.map(bI =>
              bI.prepareUpdate(billItem => {
                billItem.printStatus = billItem.isVoided ? 'void_pending' : 'pending';
              }),
            ),
          ),
      );

      const toPrint = await kitchenReceipt({
        billItems: billItemsToPrint,
        printers,
        priceGroups,
        reference: bill.reference.toString(),
        prepTime: dayjs().add(10, 'minute'),
      });

      const updates = await Promise.all(
        toPrint.map(async ({ billItems, printer, commands }) => {
          let status: PrintStatus;
          const { success } = await print(commands, printer, false);
          if (success) {
            status = 'success';
          } else {
            status = 'error';
          }
          return billItems.map(bI =>
            bI.prepareUpdate(billItem => {
              if (billItem.isVoided && status === 'error') {
                billItem.printStatus = 'void_error';
              } else {
                billItem.printStatus = status;
              }
            }),
          );
        }),
      );

      await database.action(async () => {
        await database.batch(...flatten(updates));
      });
    }
    setIsStoreDisabled(false);
  };

  useEffect(() => {
    const summary = async () => {
      const summary = await billSummary(billItems, billDiscounts, billPayments, discounts);
      setSummary(summary);
    };
    summary();
  }, [billItems, billDiscounts, billPayments, billModifierItems]); // keep billModifierItems

  const onPrint = async () => {
    const commands = await receiptBill(billItems, billDiscounts, billPayments, discounts, priceGroups, paymentTypes);
    print(commands, printers[0], false);
  };

  if (!bill || !summary) {
    return <Loading />;
  }

  const { totalDiscount, totalPayable, balance } = summary;

  return (
    <Grid style={styles.grid}>
      <Row style={styles.r1}>
        <Col>
          <Button style={styles.buttons} light onPress={onStore}>
            <Text>Bill / Table: {bill.reference || '-'}</Text>
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

      <Row>
        <ReceiptItems
          readonly={complete}
          billItems={billItemsIncPendingVoids}
          discountBreakdown={summary.discountBreakdown}
          billPayments={billPayments}
          billDiscounts={billDiscounts}
          paymentTypes={paymentTypes}
        />
      </Row>
      <Row style={styles.r3}>
        {<Text>{`Discount: ${formatNumber(totalDiscount, currencySymbol)}`}</Text>}

        <Text>{`Total: ${formatNumber(totalPayable, currencySymbol)}`}</Text>
        {complete && (
          <Text>{`Change Due: ${formatNumber(
            Math.abs(billPayments.find(payment => payment.isChange).amount),
            currencySymbol,
          )}`}</Text>
        )}
        <Text style={Fonts.h3}>{`Balance: ${formatNumber(balance, currencySymbol)}`}</Text>
      </Row>
      <Row style={styles.r4}>
        <Button style={styles.printButton} block small info onPress={onPrint}>
          <Text>Print</Text>
        </Button>
      </Row>
      {!complete && (
        <Row style={styles.r5}>
          <Col>
            <Button style={styles.buttons} block small disabled={isStoreDisabled} onPress={_onStore}>
              <Text>Store</Text>
            </Button>
          </Col>
          <Col>
            <Button style={styles.buttons} block small success onPress={onCheckout}>
              <Text>Checkout</Text>
            </Button>
          </Col>
        </Row>
      )}
    </Grid>
  );
};

const enhance = component =>
  withDatabase<any>( // TODO: type
    withObservables<ReceiptOuterProps, ReceiptInnerProps>(['bill'], ({ bill, database }) => ({
      bill,
      billPayments: bill.billPayments,
      billDiscounts: bill.billDiscounts,
      billItems: bill.billItems,
      billItemsIncPendingVoids: bill.billItemsIncPendingVoids,
      discounts: database.collections.get<Discount>(tableNames.discounts).query(),
      paymentTypes: database.collections.get<PaymentType>(tableNames.paymentTypes).query(),
      priceGroups: database.collections.get<PriceGroup>(tableNames.priceGroups).query(),
      printers: database.collections.get<Printer>(tableNames.printers).query(),
      /**
       * billModifierItems is here purely to cause a re render and recalculation of the
       * bill summary
       */
      billModifierItems: bill.billModifierItems,
    }))(component),
  );

export const Receipt = enhance(ReceiptInner);

const styles = StyleSheet.create({
  grid: {
    borderLeftWidth: 1,
    borderLeftColor: 'lightgrey',
  },
  r1: {
    height: 45,
  },
  r3: {
    borderTopColor: 'lightgrey',
    borderTopWidth: 1,
    height: 110,
    flexDirection: 'column',
    padding: 10,
  },
  r4: {
    height: 50,
  },
  r5: { height: 50 },
  buttons: {
    height: '100%',
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

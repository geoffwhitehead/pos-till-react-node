import React, { useState, useEffect } from 'react';
import { Text, Col, Grid, Row, Button } from '../../../../core';
import { StyleSheet } from 'react-native';
import {
  formatNumber,
  billSummary,
  BillSummary,
} from '../../../../utils';
import { Fonts } from '../../../../theme';
import { ReceiptItems } from './ReceiptItems';
import dayjs from 'dayjs';
import { print } from '../../../../services/printer/printer';
import { receiptBill } from '../../../../services/printer/receiptBill';
import withObservables from '@nozbe/with-observables';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { tableNames, Discount, PaymentType, PriceGroup, Bill } from '../../../../models';
import { Database } from '@nozbe/watermelondb';

// TODO: move into org and fetch from db or something
const currencySymbol = '£';

// TODO: type these
interface ReceiptInnerProps {
  billPayments: any;
  billDiscounts: any;
  billItems: any;
  discounts: any;
  paymentTypes: any;
  priceGroups: any;
}

interface ReceiptOuterProps {
  onStore?: () => void;
  onCheckout?: () => void;
  bill: Bill
  database: Database
  complete: boolean;

}

export const ReceiptInner: React.FC<ReceiptOuterProps & ReceiptInnerProps> = ({
  bill,
  billItems,
  billDiscounts,
  billPayments,
  onStore,
  onCheckout,
  complete,
  discounts,
  paymentTypes,
  priceGroups,
}) => {
  const [summary, setSummary] = useState<BillSummary>();

  useEffect(() => {
    const summary = async () => {
      const summary = await billSummary(billItems, billDiscounts, billPayments, discounts);
      setSummary(summary);
    };
    summary();
  }, [billItems, billDiscounts, billPayments]);

  const onPrint = async () => {
    const commands = await receiptBill(billItems, billDiscounts, billPayments, discounts, priceGroups, paymentTypes);
    print(commands, false);
  };

  if (!bill || !summary) {
    return <Text>Loading ... </Text>; // TODO: loading component
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
          // bill={bill}
          billItems={billItems}
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
            <Button style={styles.buttons} block small onPress={onStore}>
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
      discounts: database.collections
        .get<Discount>(tableNames.discounts)
        .query(),
      paymentTypes: database.collections
        .get<PaymentType>(tableNames.paymentTypes)
        .query(),
      priceGroups: database.collections
        .get<PriceGroup>(tableNames.priceGroups)
        .query(),
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

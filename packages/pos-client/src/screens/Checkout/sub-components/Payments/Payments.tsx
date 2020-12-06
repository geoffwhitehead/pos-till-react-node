import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { capitalize } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { OrganizationContext } from '../../../../contexts/OrganizationContext';
import { Button, Col, Grid, Input, Item, Label, Row, Text } from '../../../../core';
import { Bill, BillDiscount, BillItem, BillPayment, Discount, PaymentType, tableNames } from '../../../../models';
import { formatNumber, getDefaultCashDenominations, minimalBillSummary, MinimalBillSummary } from '../../../../utils';
import { paymentTypeNames } from '../../../../utils/consts';
import { moderateScale } from '../../../../utils/scaling';

interface PaymentOuterProps {
  bill: Bill;
  onCompleteBill: () => Promise<void>;
  database: Database;
  onBack: () => void;
}

interface PaymentInnerProps {
  discounts: Discount[];
  paymentTypes: PaymentType[];
  billDiscounts: BillDiscount[];
  billPayments: BillPayment[];
  chargableBillItems: BillItem[];
}

const PaymentsInner: React.FC<PaymentOuterProps & PaymentInnerProps> = ({
  billDiscounts,
  billPayments,
  chargableBillItems,
  bill,
  discounts,
  paymentTypes,
  onCompleteBill,
  database,
  onBack,
}) => {
  const [value, setValue] = useState<string>('');
  // TODO: this / payment types will need refactoring so not having to use find
  const cashType: PaymentType = paymentTypes.find(pt => pt.name.toLowerCase() === paymentTypeNames.CASH);

  const {
    organization: { currency },
  } = useContext(OrganizationContext);

  const denominations = getDefaultCashDenominations(currency);

  const [summary, setSummary] = useState<MinimalBillSummary>(null);

  const onValueChange = (value: string) => setValue(value);

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
  }, [billPayments, chargableBillItems, billDiscounts]);

  useEffect(() => {
    const finalize = async () => {
      await database.action(async () => {
        await bill.addPayment({ paymentType: cashType, amount: summary.balance, isChange: true });
        await bill.close();
        await Promise.all(
          billDiscounts.map(async billDiscount => {
            const amt = summary.discountBreakdown.find(d => d.billDiscountId === billDiscount.id).calculatedDiscount;
            await billDiscount.finalize(amt);
          }),
        );
      });
      onCompleteBill();
    };
    summary && summary.balance <= 0 && finalize();
  }, [summary, bill]);

  const addPayment = async (paymentType: PaymentType, amt: number) => {
    await database.action(() => bill.addPayment({ paymentType, amount: amt || Math.max(summary.balance, 0) }));
    setValue('');
  };

  const addDiscount = async (discount: Discount) => database.action(() => bill.addDiscount({ discount }));

  return (
    <Grid>
      <Col style={styles.leftPanel} />
      <Col style={styles.rightPanel}>
        <Row style={styles.backRow}>
          <Button small bordered info onPress={onBack}>
            <Text style={{ fontWeight: 'bold' }}>Back</Text>
          </Button>
        </Row>
        <Row style={styles.rowCustomAmount}>
          <Item stackedLabel style={{ width: '100%', height: moderateScale(120) }}>
            <Label>Custom amount</Label>
            <Input
              value={value}
              onChangeText={onValueChange}
              keyboardType="number-pad"
              style={{ lineHeight: moderateScale(100), fontSize: moderateScale(80) }}
            />
          </Item>
        </Row>
        <Row style={styles.row}>
          <Col style={styles.buttonColumn}>
            {discounts.map(discount => {
              return (
                <Button
                  key={discount.id}
                  full
                  onPress={() => addDiscount(discount)}
                  style={{ ...styles.button, backgroundColor: 'purple' }}
                >
                  <Text>{discount.name}</Text>
                </Button>
              );
            })}
          </Col>
          <Col style={styles.denomButtonColumn}>
            {denominations.map(amt => {
              return (
                <Button key={amt} full bordered style={styles.button} onPress={() => addPayment(cashType, amt)}>
                  <Text>{`${formatNumber(amt, currency)}`}</Text>
                </Button>
              );
            })}
          </Col>
          <Col style={styles.buttonColumn}>
            {paymentTypes.map(paymentType => {
              return (
                <Button
                  large
                  full
                  key={paymentType.id}
                  style={styles.button}
                  onPress={() => addPayment(paymentType, parseFloat(value))}
                >
                  <Text>{capitalize(paymentType.name)}</Text>
                </Button>
              );
            })}
          </Col>
        </Row>
      </Col>
    </Grid>
  );
};

const enhance = component =>
  withDatabase<any>(
    withObservables<PaymentOuterProps, PaymentInnerProps>(['bill'], ({ database, bill }) => ({
      bill,
      discounts: database.collections
        .get<Discount>(tableNames.discounts)
        .query()
        .observe(),
      paymentTypes: database.collections
        .get<PaymentType>(tableNames.paymentTypes)
        .query()
        .observe(),
      billPayments: bill.billPayments,
      billDiscounts: bill.billDiscounts,
      chargableBillItems: bill.chargableBillItems,
    }))(component),
  );

export const Payments = enhance(PaymentsInner);

const styles = StyleSheet.create({
  backRow: {
    height: moderateScale(40),
  },
  rowCustomAmount: {
    height: moderateScale(130),
  },
  row: {
    padding: moderateScale(10),
  },
  leftPanel: {
    borderRightColor: 'lightgrey',
    borderRightWidth: 1,
    backgroundColor: 'whitesmoke',
  },
  rightPanel: {
    padding: moderateScale(10),
    width: moderateScale(600),
  },
  buttonColumn: {
    flexDirection: 'column',
    padding: moderateScale(5),
  },
  denomButtonColumn: {
    flexDirection: 'column',
    padding: moderateScale(5),
    paddingLeft: moderateScale(80),
  },
  button: {
    marginBottom: moderateScale(5),
    textAlign: 'center',
    alignContent: 'center',
  },
  col: { padding: 0 },
});

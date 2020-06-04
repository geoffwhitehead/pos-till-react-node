import React, { useState, useEffect } from 'react';
import {
  Text,
  Content,
  Input,
  Item,
  Grid,
  Col,
  Button,
  Row,
  Body,
  List,
  ListItem,
  Left,
  Right,
  Label,
} from '../../../../core';
import {
  DiscountProps,
  BillPaymentSchema,
  PaymentTypeProps,
  BillDiscountSchema,
  BillProps,
  BillDiscountProps,
  BillPaymentProps,
  BillItemProps,
} from '../../../../services/schemas';
import { realm } from '../../../../services/Realm';
import uuidv4 from 'uuid';
import { balance, formatNumber, billSummary } from '../../../../utils';
import { StyleSheet } from 'react-native';
import { paymentTypeNames } from '../../../../api/paymentType';
import { capitalize } from 'lodash';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { tNames } from '../../../../models';

interface PaymentProps {
  bill: BillProps; // fix
  discounts: DiscountProps[];
  paymentTypes: PaymentTypeProps[];
  onCompleteBill: () => Promise<void>;
  billDiscounts: BillDiscountProps[];
  billPayments: BillPaymentProps[];
  billItems: BillItemProps[];
}

const PaymentsInner: React.FC<PaymentProps> = ({
  billDiscounts,
  billPayments,
  billItems,
  bill,
  discounts,
  paymentTypes,
  onCompleteBill,
  database,
}) => {
  const [value, setValue] = useState<string>('');
  // TODO: this / payment types will need refactoring so were not having to use find
  const cashType = paymentTypes.find(pt => pt.name === paymentTypeNames.CASH);
  const denominations = [500, 1000, 2000, 3000, 5000]; // TODO: grab from org settings or create new table, will vary based on currency
  // TODO: refactor to grab currency from org
  const currencySymbol = '£';

  const [summary, setSummary] = useState(null);

  // const checkComplete = async () => balance(currentBill) <= 0 && (await onCompleteBill(currentBill));

  const onValueChange = (value: string) => setValue(value);

  useEffect(() => {
    const summary = async () => {
      const summary = await billSummary(billItems, billDiscounts, billPayments, discounts);
      setSummary(summary);
    };
    summary();
  }, [billPayments, billItems, billDiscounts]);

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

  const addPayment = (paymentType: PaymentTypeProps, amt: number) => async () => {
    await database.action(() => bill.addPayment({ paymentType, amount: amt || Math.max(summary.balance, 0) }));
    setValue('');
  };

  const addDiscount = (discount: DiscountProps) => async () => {
    await database.action(() => bill.addDiscount({ discount }));
  };

  return (
    <Content>
      <Grid>
        <Col />
        <Col>
          <Row style={styles.row}>
            <Item stackedLabel style={{ width: '100%', height: 40 }}>
              <Label>Custom amount</Label>
              <Input value={value} onChangeText={onValueChange} keyboardType="number-pad" />
            </Item>
          </Row>
          <Row style={styles.row}>
            <List style={{ width: '100%', height: '100%' }}>
              <ListItem itemHeader first>
                <Text>Discounts</Text>
              </ListItem>
              {discounts.map(discount => {
                return (
                  <ListItem key={discount.id} onPress={addDiscount(discount)}>
                    <Left>
                      <Text>{discount.name}</Text>
                    </Left>
                    <Right>
                      <Text>
                        {discount.isPercent ? discount.amount + '%' : formatNumber(discount.amount, currencySymbol)}
                      </Text>
                    </Right>
                  </ListItem>
                );
              })}
            </List>
          </Row>
        </Col>
        <Col style={styles.buttonColumn}>
          {paymentTypes.map(paymentType => {
            return (
              <Button
                key={paymentType.id}
                style={styles.paymentButtons}
                onPress={addPayment(paymentType, parseFloat(value))}
              >
                <Text>{capitalize(paymentType.name)}</Text>
              </Button>
            );
          })}
          {denominations.map(amt => {
            return (
              <Button key={amt} bordered style={styles.paymentButtons} onPress={addPayment(cashType, amt)}>
                <Text>{`${formatNumber(amt, currencySymbol)}`}</Text>
              </Button>
            );
          })}
        </Col>
      </Grid>
    </Content>
  );
};

const enhance = component =>
  withDatabase<any, any>(
    withObservables(['bill'], ({ database, bill }) => ({
      discounts: database.collections
        .get(tNames.discounts)
        .query()
        .observe(),
      paymentTypes: database.collections
        .get(tNames.paymentTypes)
        .query()
        .observe(),
      bill,
      billPayments: bill.billPayments,
      billDiscounts: bill.billDiscounts,
      billItems: bill.billItems,
    }))(component),
  );

export const Payments = enhance(PaymentsInner);

const styles = StyleSheet.create({
  row: {
    padding: 10,
    borderLeftColor: 'lightgrey',
    borderLeftWidth: 1,
  },
  buttonColumn: {
    width: 125,
    flexDirection: 'column',
  },
  paymentButtons: {
    margin: 5,
    textAlign: 'center',
    alignContent: 'center',
  },
});

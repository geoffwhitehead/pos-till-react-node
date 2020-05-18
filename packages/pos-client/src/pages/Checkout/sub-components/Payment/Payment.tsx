import React, { useState } from 'react';
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
} from '../../../../services/schemas';
import { realm } from '../../../../services/Realm';
import uuidv4 from 'uuid';
import { balance, formatNumber } from '../../../../utils';
import { StyleSheet } from 'react-native';
import { paymentTypeNames } from '../../../../api/paymentType';
import { capitalize } from 'lodash';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { tNames } from '../../../../models';

interface PaymentProps {
  currentBill: BillProps; // fix
  discounts: DiscountProps[];
  paymentTypes: PaymentTypeProps[];
  onCompleteBill: (bill: BillProps) => Promise<void>;
}

export const WrappedPayments: React.FC<PaymentProps> = ({ currentBill, discounts, paymentTypes, onCompleteBill }) => {
  const [value, setValue] = useState<string>('');
  // TODO: this / payment types will need refactoring so were not having to use find
  const cashType = paymentTypes.find(pt => pt.name === paymentTypeNames.CASH);
  const denominations = [500, 1000, 2000, 3000, 5000]; // TODO: grab from org settings or create new table, will vary based on currency
  // TODO: refactor to grab currency from org
  const currencySymbol = '£';

  const checkComplete = async () => balance(currentBill) <= 0 && await onCompleteBill(currentBill);

  type OnValueChange = (value: string) => void;
  const onValueChange: OnValueChange = value => setValue(value);

  type AddPayment = (paymentType: PaymentTypeProps, amt: number) => () => void;
  const addPayment: AddPayment = (paymentType, amt) => async () => {
    await currentBill.addPayment({ paymentTypeId: paymentType._id, amount: amt || Math.max(balance(currentBill), 0) });
    // realm.write(() => {
    //   const billPayment = realm.create(BillPaymentSchema.name, {
    //     _id: uuidv4(),
    //     paymentType: paymentType.name,
    //     paymentTypeId: paymentType._id,
    //     amount: amt || Math.max(balance(currentBill), 0),
    //   });
    //   currentBill.payments.push(billPayment);
    // });
    setValue('');

    await checkComplete();
  };

  const addDiscount = (discount: DiscountProps) => async () => {
    // realm.write(() => {
    //   const billDiscount = realm.create(BillDiscountSchema.name, {
    //     _id: uuidv4(),
    //     discountId: discount._id,
    //     name: discount.name,
    //     amount: discount.amount,
    //     isPercent: discount.isPercent,
    //   });
    //   activeBill.discounts.push(billDiscount);
    // });
    await currentBill.addDiscount({ discountId: discount.id });

    await checkComplete();
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

export const Payments = withDatabase<any, any>(
  withObservables([], ({ database }) => ({
    discounts: database.collections
      .get(tNames.discounts)
      .query()
      .observe(),
    paymentTypes: database.collections
      .get(tNames.paymentTypes)
      .query()
      .observe(),
  }))(WrappedPayments),
);

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

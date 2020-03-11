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
import { StyleSheet, NativeSyntheticEvent } from 'react-native';

interface PaymentProps {
  activeBill: any; // fix
  discounts: Realm.Collection<DiscountProps>;
  paymentTypes: Realm.Collection<PaymentTypeProps>;
  onCompleteBill: (bill: BillProps) => void;
}

export const Payment: React.FC<PaymentProps> = ({ activeBill, discounts, paymentTypes, onCompleteBill }) => {
  const [value, setValue] = useState<string>('');
  console.log('value ', value);
  // TODO: this / payment types will need refactoring so were not having to use find
  const cashType = paymentTypes.find(pt => pt.name === 'Cash');
  const denominations = [500, 1000, 2000, 3000, 5000];
  // TODO: refactor to grab currency from org
  const currencySymbol = '£';

  const checkComplete = () => balance(activeBill) <= 0 && onCompleteBill(activeBill);

  type OnValueChange = (value: string) => void;
  const onValueChange: OnValueChange = value => setValue(value);

  type AddPayment = (paymentType: PaymentTypeProps, amt: number) => () => void;
  const addPayment: AddPayment = (paymentType, amt) => () => {
    console.log('!!!!!!amt, ', amt);
    realm.write(() => {
      const billPayment = realm.create(BillPaymentSchema.name, {
        _id: uuidv4(),
        paymentType: paymentType.name,
        paymentTypeId: paymentType._id,
        amount: amt || Math.max(balance(activeBill), 0),
      });
      activeBill.payments.push(billPayment);
    });
    checkComplete();
  };

  type AddDiscount = (discount: DiscountProps) => () => void;
  const addDiscount: AddDiscount = discount => () => {
    realm.write(() => {
      const billDiscount = realm.create(BillDiscountSchema.name, {
        _id: uuidv4(),
        discountId: discount._id,
        name: discount.name,
        amount: discount.amount,
        isPercent: discount.isPercent,
      });
      activeBill.discounts.push(billDiscount);
    });
    checkComplete();
  };

  return (
    <Content>
      <Grid>
        <Col />
        <Col>
          <Row style={styles.row}>
            <Item style={{ width: '100%', height: 40 }} regular>
              <Input value={value} onChangeText={onValueChange} keyboardType="number-pad" />
            </Item>
          </Row>
          {/* <Row style={styles.row}>
            {paymentTypes.map(paymentType => {
              return (
                <Button onPress={addPayment(paymentType, value)}>
                  <Text>{paymentType.name}</Text>
                </Button>
              );
            })}
          </Row>
          <Row style={styles.row}>
            {denominations.map(amt => {
              return (
                <Button onPress={addPayment(cashType, amt)}>
                  <Text>{`${currencySymbol}${formatNumber(amt, currencySymbol)}`}</Text>
                </Button>
              );
            })}
          </Row> */}
          <Row style={styles.row}>
            <List style={{ width: '100%', height: '100%' }}>
              <ListItem itemHeader first>
                <Text>Discounts</Text>
              </ListItem>
              {discounts.map(discount => {
                return (
                  <ListItem key={discount._id} onPress={addDiscount(discount)}>
                    <Left>
                      <Text>{discount.name}</Text>
                    </Left>
                    <Right>
                      <Text>{formatNumber(discount.amount, currencySymbol)}</Text>
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
                key={paymentType._id}
                style={styles.paymentButtons}
                onPress={addPayment(paymentType, parseFloat(value))}
              >
                <Text>{paymentType.name}</Text>
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

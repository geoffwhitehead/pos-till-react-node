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
} from '../../../../core';
import { DiscountProps, BillPaymentSchema, PaymentTypeProps, BillDiscountSchema } from '../../../../services/schemas';
import { realm } from '../../../../services/Realm';
import uuidv4 from 'uuid';
import { balance } from '../../../../utils';
import { StyleSheet } from 'react-native';

interface PaymentProps {
  activeBill: any; // fix
  discounts: Realm.Collection<DiscountProps>;
  paymentTypes: Realm.Collection<PaymentTypeProps>;
}

export const Payment: React.FC<PaymentProps> = ({ activeBill, discounts, paymentTypes }) => {
  const [value, setValue] = useState(0);

  // TODO: this / payment types will need refactoring so were not having to use find
  const cashType = paymentTypes.find(pt => pt.name === 'Cash');
  const denominations = [5, 10, 20, 30, 50];
  // TODO: refactor to grab currency from org
  const currencySymbol = '£';

  discounts.map(d => console.log('d', d));

  const onValueChange = value => setValue(parseFloat(value));

  const addPayment = (paymentType, amt) => () => {
    realm.write(() => {
      const billPayment = realm.create(BillPaymentSchema.name, {
        _id: uuidv4(),
        paymentType: paymentType.name,
        paymentTypeId: paymentType._id,
        amount: amt || balance(activeBill),
      });
      activeBill.payments.push(billPayment);
    });
  };

  const addDiscount = discount => () => {
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
  };

  return (
    <Content>
      <Grid style={{ height: '100%' }}>
        <Col />
        <Col style={{ height: '100%' }}>
          <Row style={styles.row}>
            <Item style={{ width: '100%' }} regular>
              <Input value={value.toString()} onChange={onValueChange} keyboardType="number-pad" />
            </Item>
          </Row>
          <Row style={styles.row}>
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
                  <Text>{`${currencySymbol}${amt}`}</Text>
                </Button>
              );
            })}
          </Row>
          <Row style={styles.row}>
            <List style={{ width: '100%', height: '100%' }}>
              <ListItem itemHeader first>
                <Text>Discounts</Text>
              </ListItem>
              {discounts.map(discount => {
                return (
                  <ListItem onPress={addDiscount(discount)}>
                    <Left>
                      <Text>{discount.name}</Text>
                    </Left>
                    <Body />
                    <Right>
                      <Text>{discount.amount}</Text>
                    </Right>
                  </ListItem>
                );
              })}
            </List>
          </Row>
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
});

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
import { DiscountProps, BillPaymentSchema, PaymentTypeProps } from '../../../../services/schemas';
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
  const addPayment = (type, amt) => () => {
    realm.write(() => {
      const payment = realm.create(BillPaymentSchema.name, {
        _id: uuidv4(),
        paymentType: type.name,
        paymentTypeId: type._id,
        amount: amt || balance(activeBill),
      });
      activeBill.payments.push(payment);
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
            {paymentTypes.map(type => {
              return (
                <Button onPress={addPayment(type, value)}>
                  <Text>{type.name}</Text>
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
                  <ListItem>
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

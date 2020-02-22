import React from 'react';
import {
  Text,
  Col,
  Grid,
  Row,
  Button,
  Content,
  List,
  ListItem,
  Left,
  Right,
  Icon,
  Body,
  Separator,
} from '../../../../core';
import { StyleSheet } from 'react-native';
import { realm } from '../../../../services/Realm';
import { Loading } from '../../../Loading/Loading';
import { balance, total, totalDiscount, discountBreakdown, formatNumber } from '../../../../utils';
import { Fonts } from '../../../../theme';

const voidItem = item => () => {
  realm.write(() => {
    item.mods.map(m => realm.delete(m));
    realm.delete(item);
  });
};

const voidPayment = payment => () => {
  realm.write(() => {
    realm.delete(payment);
  });
};

const voidDiscount = discount => () => {
  realm.write(() => {
    realm.delete(discount);
  });
};

// TODO: move into org and fetch from db or something
const currencySymbol = '£';

export const Receipt = ({ activeBill, onStore, onCheckout }) => {
  console.log('activeBill', activeBill);

  return !activeBill ? (
    <Text>Select bill</Text>
  ) : (
    <Grid style={styles.grid}>
      <Row style={{ height: 45 }}>
        <Col>
          <Button style={styles.buttons} light onPress={onStore}>
            <Text>Bill / Table: {(activeBill && activeBill.tab) || '-'}</Text>
          </Button>
        </Col>
        <Col>
          <Text>Something</Text>
        </Col>
      </Row>

      <Row>
        <ItemList activeBill={activeBill} />
      </Row>
      <Row style={styles.r3}>
        <Text>
          {activeBill.discounts.length ? `Discount: ${formatNumber(totalDiscount(activeBill), currencySymbol)}` : ''}
        </Text>
        <Text>{`Total: ${formatNumber(total(activeBill), currencySymbol)}`}</Text>
        <Text style={Fonts.h3}>{`Balance: ${formatNumber(balance(activeBill), currencySymbol)}`}</Text>
      </Row>
      <Row style={{ height: 50 }}>
        <Col>
          <Button style={styles.buttons} small onPress={onStore}>
            <Text>Store</Text>
          </Button>
        </Col>
        <Col>
          <Button style={styles.buttons} small success onPress={onCheckout}>
            <Text>Checkout</Text>
          </Button>
        </Col>
      </Row>
    </Grid>
  );
};

const styles = StyleSheet.create({
  grid: {
    borderLeftWidth: 1,
    borderLeftColor: 'lightgrey',
  },
  r3: {
    borderTopColor: 'lightgrey',
    borderTopWidth: 1,
    height: 100,
    flexDirection: 'column',
  },
  buttons: {
    height: '100%',
  },
});

const ItemList = ({ activeBill }) => {
  console.log('List active bill', activeBill);
  return (
    <Content>
      <List>
        <Separator bordered>
          <Text>Items</Text>
        </Separator>
        {activeBill.items.map(item => {
          return (
            <ListItem key={item._id}>
              <Left>
                <Icon name="ios-close" onPress={voidItem(item)} />
                <Content>
                  <Text>{`${item.name}`}</Text>
                  {item.mods.map(m => (
                    <Text key={`${m._id}name`}>{`- ${m.name}`}</Text>
                  ))}
                </Content>
              </Left>
              <Right>
                <Text>{`${formatNumber(item.price, currencySymbol)}`}</Text>
                {item.mods.map(m => (
                  <Text key={`${m._id}price`}>{formatNumber(m.price, currencySymbol)}</Text>
                ))}
              </Right>
            </ListItem>
          );
        })}

        <Separator bordered>
          <Text>Discounts</Text>
        </Separator>
        {discountBreakdown(activeBill).map(discount => {
          return (
            <ListItem key={discount._id}>
              <Left>
                <Icon name="ios-close" onPress={voidDiscount(discount)} />
                <Content>
                  {discount.isPercent ? (
                    <Text>{`Discount: ${discount.name} ${discount.amount}%`}</Text>
                  ) : (
                    <Text>{`Discount: ${discount.name} ${formatNumber(discount.amount, currencySymbol)}`}</Text>
                  )}
                </Content>
              </Left>
              <Right>
                <Text>{`${formatNumber(discount.calculatedDiscount, currencySymbol)}`}</Text>
              </Right>
            </ListItem>
          );
        })}
        <Separator bordered>
          <Text>Payments</Text>
        </Separator>
        {activeBill.payments.map(payment => {
          return (
            <ListItem key={payment._id}>
              <Left>
                <Icon name="ios-close" onPress={voidPayment(payment)} />
                <Content>
                  <Text>{`Payment: ${payment.paymentType}`}</Text>
                </Content>
              </Left>
              <Right>
                <Text>{`${formatNumber(payment.amount, currencySymbol)}`}</Text>
              </Right>
            </ListItem>
          );
        })}
      </List>
    </Content>
  );
};

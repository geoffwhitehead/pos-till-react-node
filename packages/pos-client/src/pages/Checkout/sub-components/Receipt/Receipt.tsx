import React from 'react';
import { Text, Col, Grid, Row, Button, Content, List, ListItem, Left, Right, Icon, Body } from '../../../../core';
import { StyleSheet } from 'react-native';
import { realm } from '../../../../services/Realm';
import { Loading } from '../../../Loading/Loading';
import { balance, total, totalDiscount, discountBreakdown } from '../../../../utils';
import { Fonts } from '../../../../theme';

const deleteItem = item => () => {
  realm.write(() => {
    item.mods.map(m => realm.delete(m));
    realm.delete(item);
  });
};

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
        <Text>{activeBill.discounts.length ? `Discount: ${totalDiscount(activeBill)}` : ''}</Text>
        <Text>{`Total: ${total(activeBill)}`}</Text>
        <Text style={Fonts.h3}>{`Balance: ${balance(activeBill)}`}</Text>
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
        {activeBill.items.map(item => {
          return (
            <ListItem key={item._id}>
              <Left>
                <Icon name="ios-close" onPress={deleteItem(item)} />
                <Content>
                  <Text>{`${item.name}`}</Text>
                  {item.mods.map(m => (
                    <Text key={`${m._id}name`}>{`- ${m.name}`}</Text>
                  ))}
                </Content>
              </Left>
              <Body />
              <Right>
                <Text>{`${item.price}`}</Text>
                {item.mods.map(m => (
                  <Text key={`${m._id}price`}>{m.price}</Text>
                ))}
              </Right>
            </ListItem>
          );
        })}
        {discountBreakdown(activeBill).map(discount => {
          return (
            <ListItem key={discount._id}>
              <Left>
                <Icon name="ios-close" />
                <Content>
                  <Text>{`${discount.name} ${discount.amount}`}</Text>
                  {/* {payment.mods.map(m => (
                    <Text key={`${m._id}name`}>{`- ${m.name}`}</Text>
                  ))} */}
                </Content>
              </Left>
              <Body />
              <Right>
                <Text>{`${discount.calculatedDiscount}`}</Text>
                {/* {payment.mods.map(m => (
                  <Text key={`${m._id}price`}>{m.price}</Text>
                ))} */}
              </Right>
            </ListItem>
          );
        })}
        {activeBill.payments.map(payment => {
          return (
            <ListItem key={payment._id}>
              <Left>
                <Icon name="ios-close" />
                <Content>
                  <Text>{`Paid ${payment.paymentType}`}</Text>
                  {/* {payment.mods.map(m => (
                    <Text key={`${m._id}name`}>{`- ${m.name}`}</Text>
                  ))} */}
                </Content>
              </Left>
              <Body />
              <Right>
                <Text>{`${payment.amount}`}</Text>
                {/* {payment.mods.map(m => (
                  <Text key={`${m._id}price`}>{m.price}</Text>
                ))} */}
              </Right>
            </ListItem>
          );
        })}
      </List>
    </Content>
  );
};

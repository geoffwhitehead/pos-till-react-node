import React from 'react';
import { Text, Col, Grid, Row, Button, Content, List, ListItem, Left, Right, Icon, Body } from '../../../../core';
import { StyleSheet } from 'react-native';
import { realm } from '../../../../services/Realm';
import { Loading } from '../../../Loading/Loading';

// TODO fix tpyes
const subtotal: (bill: any) => number = bill => {
  const amt = bill.items.reduce((acc, item) => {
    const mods = item.mods.reduce((acc, mod) => acc + mod.price, 0);
    return acc + mods + item.price;
  }, 0);
  return amt;
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
        <Text>{`Amount due: ${subtotal(activeBill)}`}</Text>
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
    height: 50,
  },
  buttons: {
    height: '100%',
  },
});
const deleteItem = item => () => {
  // delete here
  realm.write(() => {
    item.mods.map(m => realm.delete(m));
    realm.delete(item);
  });
};

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
              <Body></Body>
              <Right>
                <Text>{`${item.price}`}</Text>
                {item.mods.map(m => (
                  <Text key={`${m._id}price`}>{m.price}</Text>
                ))}
              </Right>
            </ListItem>
          );
        })}
      </List>
    </Content>
  );
};

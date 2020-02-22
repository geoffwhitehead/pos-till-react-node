import React from 'react'
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
} from '../../../../core'
import { StyleSheet } from 'react-native'
import { realm } from '../../../../services/Realm'

export const Receipt = ({ activeBill, onSelectBill }) => {
  console.log('activeBill', activeBill)

  return (
    <Grid style={styles.grid}>
      <Row style={{ height: 45 }}>
        <Col>
          <Button style={{ height: '100%' }} light onPress={onSelectBill}>
            <Text>Bill / Table: {(activeBill && activeBill.tab) || '-'}</Text>
          </Button>
        </Col>
        <Col style={{ backgroundColor: 'yellow' }}>
          <Text>Something</Text>
        </Col>
      </Row>

      <Row>{activeBill && <ItemList activeBill={activeBill} />}</Row>
      <Row style={styles.r3}>
        <Text>Amount due:</Text>
      </Row>
      <Row style={{ height: 50 }}>
        <Col>
          <Button style={styles.r4Buttons} small onPress={onSelectBill}>
            <Text>Store</Text>
          </Button>
        </Col>
        <Col>
          <Button style={styles.r4Buttons} small success onPress={onSelectBill}>
            <Text>Checkout</Text>
          </Button>
        </Col>
      </Row>
    </Grid>
  )
}

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
  r4Buttons: {
    height: '100%',
  },
})
const deleteItem = (item) => () => {
  // delete here
  realm.write(() => {
    item.mods.map((m) => realm.delete(m))
    realm.delete(item)
  })
}

const ItemList = ({ activeBill }) => {
  console.log('List active bill', activeBill)
  return (
    <Content>
      <List>
        {activeBill.items.map((item) => {
          return (
            <ListItem key={item._id}>
              <Left>
                <Icon name="ios-close" onPress={deleteItem(item)} />
                <Content>
                  <Text>{`${item.name}`}</Text>
                  {item.mods.map((m) => (
                    <Text key={`${m._id}name`}>{`- ${m.name}`}</Text>
                  ))}
                </Content>
              </Left>
              <Body></Body>
              <Right>
                <Text>{`${item.price}`}</Text>
                {item.mods.map((m) => (
                  <Text key={`${m._id}price`}>{m.price}</Text>
                ))}
              </Right>
            </ListItem>
          )
        })}
      </List>
    </Content>
  )
}

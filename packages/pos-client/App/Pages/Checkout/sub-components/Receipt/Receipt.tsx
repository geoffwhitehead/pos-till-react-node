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
} from '../../../../core'
import { StyleSheet } from 'react-native'

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

      <Row>{activeBill && <SwipableList activeBill={activeBill} />}</Row>
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
const deleteItem = (data) => () => {
  // delete here
  console.log('delete data', data)
}

const info = (data) => () => {
  // info here
  console.log('info data', data)
}

const SwipableList = ({ activeBill }) => {
  console.log('List active bill', activeBill)
  return (
    <Content>
      <List>
        {activeBill.items.map((item) => {
          return (
            <ListItem key={item._id}>
              <Text>{`${item.name} ${item.price}`}</Text>

              <Text>{`${item.name} ${item.price}`}</Text>
            </ListItem>
          )
        })}
      </List>
    </Content>
  )
}

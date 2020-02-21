import React from 'react'
import {
  Text,
  Col,
  Grid,
  Row,
  Button,
  Header,
  Content,
  List,
  ListItem,
  Icon,
} from '../../../../core'

export const Receipt = ({ activeBill, onSelectBill }) => {
  console.log('activeBill', activeBill)

  return (
    <Grid>
      <Row style={{ height: 75 }}>
        <Col>
          <Button light small onPress={onSelectBill}>
            <Text>{(activeBill && activeBill.tab) || '-'}</Text>
          </Button>
        </Col>
        <Col style={{ backgroundColor: 'yellow' }}>
          <Text>Something</Text>
        </Col>
      </Row>

      {activeBill && (
        <Row>
          <SwipableList activeBill={activeBill} />
        </Row>
      )}
    </Grid>
  )
}

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
      <List
        leftOpenValue={75}
        rightOpenValue={-75}
        dataArray={activeBill.items}
        renderRow={(item) => (
          <ListItem key={item._id}>
            <Text>{`${item.name} ${item.price}`}</Text>
          </ListItem>
        )}
        renderLeftHiddenRow={(item) => (
          <Button full onPress={info(item)}>
            <Icon active name="information-circle" />
          </Button>
        )}
        renderRightHiddenRow={(item, secId, rowId, rowMap) => (
          <Button full danger onPress={deleteItem(item)}>
            <Icon active name="trash" />
          </Button>
        )}
      />
    </Content>
  )
}

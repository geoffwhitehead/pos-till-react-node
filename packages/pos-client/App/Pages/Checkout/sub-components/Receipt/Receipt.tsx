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
  return (
    <Grid>
      <Row style={{ height: 75, backgroundColor: 'teal' }}>
        <Col style={{ backgroundColor: 'teal' }}>
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

const SwipableList = (activeBill) => {
  return (
    <Content>
      <List
        leftOpenValue={75}
        rightOpenValue={-75}
        dataSource={activeBill.items}
        renderRow={(item) => (
          <ListItem>
            <Text> {item.name} </Text>
          </ListItem>
        )}
        renderLeftHiddenRow={(data) => (
          <Button full onPress={info(data)}>
            <Icon active name="information-circle" />
          </Button>
        )}
        renderRightHiddenRow={(data, secId, rowId, rowMap) => (
          <Button full danger onPress={deleteItem(data)}>
            <Icon active name="trash" />
          </Button>
        )}
      />
    </Content>
  )
}

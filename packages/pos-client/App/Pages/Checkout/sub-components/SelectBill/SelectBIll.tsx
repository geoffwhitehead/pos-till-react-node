import React from 'react'
import {
  Text,
  Content,
  List,
  ListItem,
  Button,
  Badge,
  Left,
  Body,
  Right,
  Icon,
} from '../../../../core'
import { routes } from '../../../../navigators/CheckoutItemNavigator'
import { useRealmQuery } from 'react-use-realm'
import { BillRegister, BillSchema } from '../../../../services/schemas'
import { realm } from '../../../../services/Realm'
import uuidv4 from 'uuid/v4'

export const SelectBill: React.FC = ({ navigation }) => {
  const billRegister = useRealmQuery({ source: BillRegister.name })

  const billsArr = [billRegister[0].maxBills].map((n, index) => {
    const found = billRegister[0].openBills.find((ob) => ob.tab === index)
    return found || {}
  })

  const setActiveBillFactory = (bill, index) => () => {
    realm.write(() => {
      if (!bill) {
        const _id = uuidv4()
        realm.create(BillSchema.name, { _id, tab: index })
        billRegister[0].activeBill = _id
      } else {
        billRegister[0].activeBill = bill._id
      }
    })
  }
  const goBack = () => navigation.goBack()

  const sum = (billPayments) => billPayments.reduce((acc, cur) => acc + cur.price, 0)
  return (
    <Content>
      <List>
        <ListItem itemHeader first>
          <Left>
            <Icon onPress={goBack} name="ios-arrow-back" />
            <Text>Bills</Text>
          </Left>
          <Body />
          <Right />
        </ListItem>
        {billsArr.map((bill, index) => {
          return (
            <ListItem icon onPress={setActiveBillFactory(bill, index)}>
              <Left>{bill ? <Badge success>Open</Badge> : <Badge>Closed</Badge>}</Left>
              <Body>
                <Text>{bill ? sum(bill.payments) : ''}</Text>
              </Body>
              <Right></Right>
            </ListItem>
          )
        })}
      </List>
    </Content>
  )
}

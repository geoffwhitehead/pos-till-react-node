import React from 'react'
import {
  Text,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
} from '../../../../core'

interface SelectBillProps {
  openBills: any // TODO: fix realm types
  maxBills: number;
  onSelectBill: (index: number, bill: any) => void
}

export const SelectBill: React.FC<SelectBillProps> = ({ openBills, maxBills, onSelectBill }) => {
  const bills = openBills.reduce((acc, bill) => {
    acc[bill.tab - 1] = bill
    return [...acc]
  }, Array(maxBills).fill(null))

  console.log('!!!!!!!bills', bills)
  const onSelectBillFactory = (tab, bill) => () => onSelectBill(tab, bill)
  const sum = (billPayments) => billPayments.reduce((acc, cur) => acc + cur.price, 0)
  return (
    <Content>
      <List>
        <ListItem itemHeader first>
          <Text>Bills</Text>
        </ListItem>
        {bills.map((bill, index) => {
          const tab = index + 1
          return (
            <ListItem key={index} icon onPress={onSelectBillFactory(tab, bill)}>
              <Left>
                <Text>{`${tab} ${bill ? 'Open' : 'Closed'}`}</Text>
              </Left>
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

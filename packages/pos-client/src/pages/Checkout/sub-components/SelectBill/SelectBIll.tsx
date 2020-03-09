import React, { useState } from 'react';
import { Text, Content, List, ListItem, Left, Body, Right, Button } from '../../../../core';
import { formatNumber, balance } from '../../../../utils';

interface SelectBillProps {
  openBills: any; // TODO: fix realm types
  maxBills: number;
  onSelectBill: (index: number, bill: any) => void;
}

// TODO: fetch from org / state
const symbol = '£';

export const SelectBill: React.FC<SelectBillProps> = ({ openBills, maxBills, onSelectBill }) => {
  const bills = openBills.reduce((acc, bill) => {
    acc[bill.tab - 1] = bill;
    return [...acc];
  }, Array(maxBills).fill(null));

  const [showOpen, setShowOpen] = useState<boolean>(false);

  const onSelectBillFactory = (tab, bill) => () => onSelectBill(tab, bill);
  const sum = billPayments => billPayments.reduce((acc, cur) => acc + cur.price, 0);
  const toggleOpenOnlyFilter = () => setShowOpen(!showOpen);

  const filterOpenOnly = bill => (showOpen ? bill : true);
  return (
    <Content>
      <List>
        <ListItem itemHeader first>
          <Left>
            <Text>Bills </Text>
          </Left>
          <Right>
            <Button active={true} info onPress={toggleOpenOnlyFilter}>
              <Text>Show open</Text>
            </Button>
          </Right>
        </ListItem>
        {bills.filter(filterOpenOnly).map((bill, index) => {
          const tab = index + 1;
          const color = bill ? 'green' : 'red';
          return (
            <ListItem key={index} icon onPress={onSelectBillFactory(tab, bill)}>
              <Left>
                <Text style={{ color }}>{`${tab} ${bill ? 'Open' : 'Closed'}`}</Text>
              </Left>
              <Body>
                <Text>{bill ? formatNumber(balance(bill), symbol) : ''}</Text>
              </Body>
              <Right></Right>
            </ListItem>
          );
        })}
      </List>
    </Content>
  );
};

import React, { useState } from 'react';
import { Text, Content, List, ListItem, Left, Body, Right, Button, Separator } from '../../../../core';
import { formatNumber, balance, total } from '../../../../utils';
import { BillProps } from '../../../../services/schemas';

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

  type OnSelectBillFactory = (tab: number, bill: BillProps) => () => void;
  const onSelectBillFactory: OnSelectBillFactory = (tab, bill) => () => onSelectBill(tab, bill);
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
        <ListItem itemHeader>
          <Left>
            <Text>State</Text>
          </Left>
          <Body>
            <Text>Balance</Text>
          </Body>
          <Right>
            <Text>Total</Text>
          </Right>
        </ListItem>
        {bills.filter(filterOpenOnly).map((bill, index) => {
          const tab = index + 1;
          const color = bill ? 'green' : 'red';

          return (
            <ListItem key={index} onPress={onSelectBillFactory(tab, bill)}>
              <Left>
                <Text style={{ color }}>{`${tab}: ${bill ? 'Open' : 'Closed'}`}</Text>
              </Left>
              <Body>
                <Text style={{ color: 'grey' }}>{bill ? formatNumber(balance(bill), symbol) : ''}</Text>
              </Body>
              <Right>
                <Text style={{ color: 'grey' }}>{bill ? formatNumber(total(bill), symbol) : ''}</Text>
              </Right>
            </ListItem>
          );
        })}
      </List>
    </Content>
  );
};

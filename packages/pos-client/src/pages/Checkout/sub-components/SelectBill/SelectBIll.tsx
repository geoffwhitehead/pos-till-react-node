import React, { useState, useContext } from 'react';
import { Text, Content, List, ListItem, Left, Body, Right, Button, Separator } from '../../../../core';
import { formatNumber, balance, total } from '../../../../utils';
import { BillProps } from '../../../../services/schemas';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { tNames } from '../../../../models';
import { Q } from '@nozbe/watermelondb';
import { CurrentBillContext } from '../../../../contexts/CurrentBillContext';

interface SelectBillProps {
  openBills: any; // TODO: fix realm types
  maxBills: number;
  onSelectBill: (index: number, bill: any) => void;
}

// TODO: fetch from org / state
const symbol = '£';
const maxBills = 40; // TODO: move to org settings

export const WrappedSelectBill: React.FC<SelectBillProps> = ({ database, billPeriod, openBills }) => {
  const { setCurrentBill } = useContext(CurrentBillContext);
  const [showOpen, setShowOpen] = useState<boolean>(false);

  console.log('*******');
  console.log('billPeriod', billPeriod);
  console.log('openBills', openBills);

  const bills = openBills.reduce((acc, bill) => {
    acc[bill.reference - 1] = bill;
    return [...acc];
  }, Array(maxBills).fill(null));

  const onSelectBillFactory = (reference: number, bill: BillProps) => () => {
    database.action(async () => {
      // const billCollection = database.collections.get(tNames.bills);

      // const bill = await billCollection.create(bill => {
      //   bill.reference = ref;
      //   bill.isClosed = false;
      //   bill.billPeriodId = billPeriod.id;
      // });

      const bill = await billPeriod.createBill({ reference });
      setCurrentBill(bill);
    });
  };

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
                <Text>{bill ? 'BILL' : 'nope'}</Text>
                {/* <Text style={{ color: 'grey' }}>{bill ? formatNumber(balance(bill), symbol) : ''}</Text> */}
              </Body>
              <Right>
                {/* <Text style={{ color: 'grey' }}>{bill ? formatNumber(total(bill), symbol) : ''}</Text> */}
              </Right>
            </ListItem>
          );
        })}
      </List>
    </Content>
  );
};

export const SelectBill = withDatabase<any, any>( // TODO: fix type
  withObservables(['billPeriod'], ({ billPeriod }) => ({
    openBills: billPeriod.openBills,
  }))(WrappedSelectBill),
);

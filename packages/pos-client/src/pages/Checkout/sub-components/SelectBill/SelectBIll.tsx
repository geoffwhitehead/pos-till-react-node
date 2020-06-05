import React, { useState, useContext } from 'react';
import { Text, Content, List, ListItem, Left, Body, Right, Button, Separator } from '../../../../core';
import { BillProps } from '../../../../services/schemas';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { CurrentBillContext } from '../../../../contexts/CurrentBillContext';
import { BillRowEmpty } from './BillRowEmpty';
import { BillRow } from './BillRow';

interface SelectBillProps {
  openBills: any; // TODO: fix types
  maxBills: number;
  billPeriod: any;
  onSelectBill?: (bill: any) => void;
}

// TODO: fetch from org / state
const maxBills = 40; // TODO: move to org settings

export const WrappedSelectBill: React.FC<SelectBillProps> = ({ onSelectBill, openBills, billPeriod }) => {
  const { setCurrentBill } = useContext(CurrentBillContext);
  const [showOpen, setShowOpen] = useState<boolean>(false);

  const bills = openBills.reduce((acc, bill) => {
    acc[bill.reference - 1] = bill;
    return [...acc];
  }, Array(maxBills).fill(null));

  const _onSelectBill = (bill: BillProps) => {
    setCurrentBill(bill);
    onSelectBill && onSelectBill(bill);
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
        {bills
          .filter(filterOpenOnly)
          .map((bill, index) =>
            bill ? (
              <BillRow key={bill.id} bill={bill} onSelectBill={_onSelectBill} />
            ) : (
              <BillRowEmpty billPeriod={billPeriod} key={index} reference={index + 1} onSelectBill={_onSelectBill} />
            ),
          )}
      </List>
    </Content>
  );
};

const enhance = c =>
  withDatabase<any>(
    withObservables(['billPeriod'], ({ billPeriod, database }) => ({
      billPeriod,
      openBills: billPeriod.openBills,
    }))(c),
  );

export const SelectBill = enhance(WrappedSelectBill);

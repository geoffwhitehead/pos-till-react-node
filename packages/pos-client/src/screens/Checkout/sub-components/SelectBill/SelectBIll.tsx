import React, { useState, useContext } from 'react';
import { Text, Content, List, ListItem, Left, Body, Right, Button } from '../../../../core';
import withObservables from '@nozbe/with-observables';
import { CurrentBillContext } from '../../../../contexts/CurrentBillContext';
import { BillRowEmpty } from './BillRowEmpty';
import { BillRow } from './BillRow';
import { Bill, BillPeriod } from '../../../../models';
import { OrganizationContext } from '../../../../contexts/OrganizationContext';

interface SelectBillInnerProps {
  openBills: any; // TODO: fix types
}

interface SelectBillOuterProps {
  billPeriod: BillPeriod;
  onSelectBill?: (bill: Bill) => void; // Created from 2 places
}

export const WrappedSelectBill: React.FC<SelectBillOuterProps & SelectBillInnerProps> = ({
  onSelectBill,
  openBills,
  billPeriod,
}) => {
  const { setCurrentBill } = useContext(CurrentBillContext);
  const { organization } = useContext(OrganizationContext);

  console.log('organization', organization);
  const [showOpen, setShowOpen] = useState<boolean>(false);

  const bills: (Bill | null)[] = openBills.reduce((acc, bill) => {
    acc[bill.reference - 1] = bill;
    return [...acc];
  }, Array(organization.maxBills).fill(null));

  const _onSelectBill = (bill: Bill) => {
    setCurrentBill(bill);
    onSelectBill && onSelectBill(bill);
  };

  const toggleOpenOnlyFilter = () => setShowOpen(!showOpen);
  const filterOpenOnly = bill => (showOpen ? bill : true);

  console.log('bills', bills);
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
          return bill ? (
            <BillRow key={bill.id} bill={bill} onSelectBill={_onSelectBill} />
          ) : (
            <BillRowEmpty
              key={'k' + index + 1}
              billPeriod={billPeriod}
              reference={index + 1}
              onSelectBill={_onSelectBill}
            />
          );
        })}
      </List>
    </Content>
  );
};

const enhance = withObservables<SelectBillOuterProps, SelectBillInnerProps>(['billPeriod'], ({ billPeriod }) => ({
  billPeriod,
  openBills: billPeriod.openBills,
}));

export const SelectBill = enhance(WrappedSelectBill);

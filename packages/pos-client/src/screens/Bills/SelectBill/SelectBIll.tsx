import withObservables from '@nozbe/with-observables';
import React, { useContext, useState } from 'react';
import { CurrentBillContext } from '../../../contexts/CurrentBillContext';
import { OrganizationContext } from '../../../contexts/OrganizationContext';
import { Button, Content, Left, List, ListItem, Right, Text } from '../../../core';
import { Bill, BillPeriod } from '../../../models';
import { BillRow } from './BillRow';
import { BillRowEmpty } from './BillRowEmpty';

interface SelectBillInnerProps {
  openBills: Bill[];
}

interface SelectBillOuterProps {
  billPeriod: BillPeriod;
  /**
   * Optional hook in to select bill on change.
   * This is used when navigated to from the sidebar to redirect the user to the checkout page.
   */
  onSelectBill?: (bill: Bill) => void;
}

export const WrappedSelectBill: React.FC<SelectBillOuterProps & SelectBillInnerProps> = ({
  onSelectBill,
  openBills,
  billPeriod,
}) => {
  const { setCurrentBill } = useContext(CurrentBillContext);
  const { organization } = useContext(OrganizationContext);

  const [isFilterOpenOnly, setIsFilterOpenOnly] = useState<boolean>(false);

  const bills: (Bill | null)[] = openBills.reduce((acc, bill) => {
    acc[bill.reference - 1] = bill;
    return [...acc];
  }, Array(organization.maxBills).fill(null));

  const _onSelectBill = (bill: Bill) => {
    setCurrentBill(bill);
    onSelectBill && onSelectBill(bill);
  };

  const toggleOpenOnlyFilter = () => setIsFilterOpenOnly(!isFilterOpenOnly);
  const filterOpenOnly = bill => (isFilterOpenOnly ? !!bill : true);

  return (
    <Content>
      <List>
        <ListItem itemHeader first>
          <Left>
            <Text>Bills </Text>
          </Left>
          <Right>
            <Button active={isFilterOpenOnly} small info onPress={toggleOpenOnlyFilter}>
              <Text>{isFilterOpenOnly ? 'Show all' : 'Show only open'}</Text>
            </Button>
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

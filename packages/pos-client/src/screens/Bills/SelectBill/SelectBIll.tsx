import withObservables from '@nozbe/with-observables';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SwitchSelector } from '../../../components/SwitchSelector/SwitchSelector';
import { CurrentBillContext } from '../../../contexts/CurrentBillContext';
import { OrganizationContext } from '../../../contexts/OrganizationContext';
import { Content, Footer, Left, List, ListItem, Right, Text } from '../../../core';
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
  const [bills, setBills] = useState<(Bill | null)[]>([]);
  const [isFilterOpenSelected, setIsFilterOpenSelected] = useState(0);

  useEffect(() => {
    const filterOpenOnly = bill => (isFilterOpenSelected ? !!bill : true);

    const billsArr = openBills.reduce((acc, bill) => {
      acc[bill.reference - 1] = bill;
      return [...acc];
    }, Array(organization.maxBills).fill(null));

    setBills(billsArr.filter(filterOpenOnly));
  }, [openBills, isFilterOpenSelected]);

  const _onSelectBill = (bill: Bill) => {
    setCurrentBill(bill);
    onSelectBill && onSelectBill(bill);
  };

  return (
    <>
      <Content>
        <List>
          <ListItem itemHeader first>
            <Left />
            <Right>
              <SwitchSelector
                options={[
                  { label: 'Show All', value: 0 },
                  { label: 'Show Open', value: 1 },
                ]}
                initial={isFilterOpenSelected}
                onPress={value => setIsFilterOpenSelected(value as number)}
                style={{ paddingRight: 10 }}
              />
            </Right>
          </ListItem>
          <ScrollView>
            {bills.map((bill, index) => {
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
          </ScrollView>
        </List>
      </Content>
      <Footer>
        <Text style={{ padding: 10 }} note>{`Open bills: ${openBills.length} / ${bills.length}`}</Text>
      </Footer>
    </>
  );
};

const enhance = withObservables<SelectBillOuterProps, SelectBillInnerProps>(['billPeriod'], ({ billPeriod }) => ({
  billPeriod,
  openBills: billPeriod.openBills,
}));

export const SelectBill = enhance(WrappedSelectBill);

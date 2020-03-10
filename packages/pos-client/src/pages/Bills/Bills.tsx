import React from 'react';
import { Text, Container } from '../../core';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
import { SelectBill } from '../Checkout/sub-components/SelectBill/SelectBIll';
import { BillSchema, BillProps } from '../../services/schemas';
import { useRealmQuery } from 'react-use-realm';
import { routes } from '../../navigators/SidebarNavigator';
import { realm } from '../../services/Realm';
import uuidv4 from 'uuid';

// TODO: move to org
const maxBills = 40;

export const Bills = ({ navigation }) => {
  const openBills = useRealmQuery<BillProps>({ source: BillSchema.name, filter: `isClosed = false` });
  const openDrawer = () => navigation.openDrawer();

  const navigateToCheckout = bill => navigation.navigate(routes.checkout, { initialBill: bill });

  // TODO: onSelectBill function duped in drawer->checkout ... refactor
  const onSelectBill = (tab, bill) => {
    if (bill) {
      navigateToCheckout(bill);
    } else {
      realm.write(() => {
        const bill = realm.create(BillSchema.name, { _id: uuidv4(), tab });
        navigateToCheckout(bill);
      });
    }
  };

  return (
    <Container>
      <SidebarHeader title="Bills" onOpen={openDrawer} />
      <SelectBill openBills={openBills} maxBills={maxBills} onSelectBill={onSelectBill} />
    </Container>
  );
};

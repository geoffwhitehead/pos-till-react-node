import React, { useContext } from 'react';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
import { BillPeriodContext } from '../../contexts/BillPeriodContext';
import { Container } from '../../core';
import { sidebarRoutes } from '../../navigators/SidebarNavigator';
import { SelectBill } from './SelectBill/SelectBIll';

export const Bills = ({ navigation }) => {
  const openDrawer = () => navigation.openDrawer();
  const { billPeriod } = useContext(BillPeriodContext);
  const onSelectBill = () => navigation.navigate(sidebarRoutes.checkout);

  return (
    <Container>
      <SidebarHeader title="Bills" onOpen={openDrawer} />
      <SelectBill billPeriod={billPeriod} onSelectBill={onSelectBill} />
    </Container>
  );
};

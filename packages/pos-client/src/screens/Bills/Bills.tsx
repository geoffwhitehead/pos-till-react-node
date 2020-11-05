import React, { useContext } from 'react';
import { Container } from '../../core';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
import { SelectBill } from './SelectBill/SelectBIll';
import { sidebarRoutes } from '../../navigators/SidebarNavigator';
import { BillPeriodContext } from '../../contexts/BillPeriodContext';

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

import React, { useState, useEffect, useContext } from 'react';
import { Container, Grid, Col } from '../../core';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
import { CheckoutItemNavigator } from '../../navigators/CheckoutItemNavigator';
import { Receipt } from './sub-components/Receipt/Receipt';
import { SelectBill } from './sub-components/SelectBill/SelectBIll';
import { Payments } from './sub-components/Payments/Payments';
import { CompleteBill } from './sub-components/CompleteBill/CompleteBill';
import { BillPeriodContext } from '../../contexts/BillPeriodContext';
import { CurrentBillContext } from '../../contexts/CurrentBillContext';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { SidebarDrawerStackParamList } from '../../navigators/SidebarNavigator';
import { Loading } from '../../components/Loading/Loading';

export enum Modes {
  Payments = 'payments',
  Bills = 'bills',
  Items = 'items',
  Loading = 'loading',
  Complete = 'complete',
  Watermelon = 'watermelon',
}

interface CheckoutProps {
  navigation: DrawerNavigationProp<SidebarDrawerStackParamList, 'Checkout'>;
}

export const Checkout: React.FC<CheckoutProps> = ({ navigation }) => {
  const { billPeriod } = useContext(BillPeriodContext);
  const { currentBill, setCurrentBill } = useContext(CurrentBillContext);

  const [mode, setMode] = useState<Modes>(Modes.Items);

  const clearBill = async () => {
    setCurrentBill(null);
    setMode(Modes.Bills);
  };
  const openDrawer = () => navigation.openDrawer();
  const onCheckout = () => setMode(Modes.Payments);

  useEffect(() => {
    if (!currentBill) {
      setMode(Modes.Bills);
    } else {
      setMode(Modes.Items);
    }
  }, [currentBill]);

  const completeBill = async () => {
    setMode(Modes.Complete);
  };

  const renderMainPanel = () => {
    switch (mode) {
      case Modes.Loading:
        return <Loading />;
      case Modes.Payments:
        return <Payments bill={currentBill} onCompleteBill={completeBill} />;
      case Modes.Bills:
        return <SelectBill billPeriod={billPeriod} />;
      case Modes.Items:
        return <CheckoutItemNavigator />;
      case Modes.Complete:
        return <CompleteBill bill={currentBill} onCloseBill={clearBill} />;
    }
  };

  return (
    <Container>
      <SidebarHeader title="Checkout" onOpen={openDrawer} disableNav={mode === Modes.Complete} />
      <Grid>
        <Col>{renderMainPanel()}</Col>
        <Col style={{ width: 350 }}>
          {currentBill && (
            <Receipt
              bill={currentBill}
              onStore={clearBill}
              onCheckout={onCheckout}
              complete={mode === Modes.Complete}
            />
          )}
        </Col>
      </Grid>
    </Container>
  );
};

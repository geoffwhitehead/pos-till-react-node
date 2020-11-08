import { DrawerNavigationProp } from '@react-navigation/drawer';
import React, { useContext, useEffect, useState } from 'react';
import { Loading } from '../../components/Loading/Loading';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
import { BillPeriodContext } from '../../contexts/BillPeriodContext';
import { CurrentBillContext } from '../../contexts/CurrentBillContext';
import { Col, Container, Grid } from '../../core';
import { CheckoutItemNavigator } from '../../navigators/CheckoutItemNavigator';
import { SidebarDrawerStackParamList } from '../../navigators/SidebarNavigator';
import { SelectBill } from '../Bills/SelectBill/SelectBIll';
import { CompleteBill } from './sub-components/CompleteBill/CompleteBill';
import { Payments } from './sub-components/Payments/Payments';
import { Receipt } from './sub-components/Receipt/Receipt';

export enum Modes {
  Payments = 'payments',
  Bills = 'bills',
  Items = 'items',
  Loading = 'loading',
  Complete = 'complete',
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

  const isSelectBillMode = mode === Modes.Bills;

  return (
    <Container>
      <SidebarHeader title="Checkout" onOpen={openDrawer} disableNav={mode === Modes.Complete} />
      <Grid>
        <Col>{renderMainPanel()}</Col>
        {!isSelectBillMode && (
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
        )}
      </Grid>
    </Container>
  );
};

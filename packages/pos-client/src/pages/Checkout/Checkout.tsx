import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { Container, Grid, Col, Text } from '../../core';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
import { Loading } from '../Loading/Loading';
import { useRealmQuery } from 'react-use-realm';
import { BillSchema, DiscountProps, DiscountSchema, PaymentTypeProps, PaymentTypeSchema } from '../../services/schemas';
import { CheckoutItemNavigator } from '../../navigators/CheckoutItemNavigator';
import { Receipt } from './sub-components/Receipt/Receipt';
import { SelectBill } from './sub-components/SelectBill/SelectBIll';
import { realm } from '../../services/Realm';
import uuidv4 from 'uuid';
import { Payment } from './sub-components/Payment/Payment';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\nCmd+D or shake for dev menu.',
  android: 'Double tap R on your keyboard to reload,\nShake or press menu button for dev menu.',
});
export enum Modes {
  Payments = 'payments',
  Bills = 'bills',
  Items = 'items',
  Loading = 'loading',
}

export const Checkout = ({ navigation }) => {
  const openBills = useRealmQuery({ source: BillSchema.name, filter: `isClosed = false` });
  const discounts = useRealmQuery<DiscountProps>({ source: DiscountSchema.name });
  const paymentTypes = useRealmQuery<PaymentTypeProps>({ source: PaymentTypeSchema.name });

  const [activeBill, setActiveBill] = useState(null);
  const [mode, setMode] = useState<Modes>(Modes.Items);

  const clearBill = () => setActiveBill(null);
  const openDrawer = () => navigation.openDrawer();
  const onCheckout = () => setMode(Modes.Payments);

  useEffect(() => (!openBills || !paymentTypes || !discounts) && setMode(Modes.Loading), [
    openBills,
    paymentTypes,
    discounts,
  ]);
  useEffect(() => (!activeBill ? setMode(Modes.Bills) : setMode(Modes.Items)), [activeBill]);

  const onSelectBill = (tab, bill) => {
    if (bill) {
      setActiveBill(bill);
    } else {
      let b;
      realm.write(() => {
        b = realm.create(BillSchema.name, { _id: uuidv4(), tab });
      });
      setActiveBill(b);
    }
  };

  const renderMain = () => {
    switch (mode) {
      case Modes.Loading:
        return <Loading />;
      case Modes.Payments:
        return <Payment activeBill={activeBill} discounts={discounts} paymentTypes={paymentTypes} />;
      case Modes.Bills:
        return <SelectBill maxBills={40} openBills={openBills} onSelectBill={onSelectBill} />;
      case Modes.Items:
        return <CheckoutItemNavigator activeBill={activeBill} />;
    }
  };

  return (
    <Container>
      <SidebarHeader title="Checkout" onOpen={openDrawer} />
      <Grid>
        <Col>{renderMain()}</Col>
        <Col style={{ width: 350 }}>
          {activeBill && <Receipt activeBill={activeBill} onStore={clearBill} onCheckout={onCheckout} />}
        </Col>
      </Grid>
    </Container>
  );
};

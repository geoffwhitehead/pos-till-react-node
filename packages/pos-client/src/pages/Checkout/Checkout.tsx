import React, { useState, useEffect, useContext, createContext } from 'react';
import { Platform } from 'react-native';
import { Container, Grid, Col, Text } from '../../core';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
import { Loading } from '../Loading/Loading';
import { useRealmQuery } from 'react-use-realm';
import {
  BillSchema,
  DiscountProps,
  DiscountSchema,
  PaymentTypeProps,
  PaymentTypeSchema,
  BillProps,
  BillPaymentSchema,
} from '../../services/schemas';
import { CheckoutItemNavigator } from '../../navigators/CheckoutItemNavigator';
import { Receipt } from './sub-components/Receipt/Receipt';
import { SelectBill } from './sub-components/SelectBill/SelectBIll';
import { realm } from '../../services/Realm';
import uuidv4 from 'uuid';
import { Payment } from './sub-components/Payment/Payment';
import { balance } from '../../utils';
import { CompleteBill } from './sub-components/CompleteBill/CompleteBill';
import { BillPeriodContext } from '../../contexts/BillPeriodContext';
import dayjs from 'dayjs';
import { paymentTypeNames } from '../../api/paymentType';

export enum Modes {
  Payments = 'payments',
  Bills = 'bills',
  Items = 'items',
  Loading = 'loading',
  Complete = 'complete',
}

// TODO: move to org settings
const maxBills = 40;

interface CheckoutProps {
  navigation: any; // TODO: fix
  selectedBill: any; // TODO
  route: any; //fix
}

export const Checkout: React.FC<CheckoutProps> = ({ navigation, route }) => {
  const { billPeriod } = useContext(BillPeriodContext);
  // const selectedBill = route.params?.selectedBill;

  const openBills = useRealmQuery<BillProps>({ source: BillSchema.name, filter: `isClosed = false` });
  const discounts = useRealmQuery<DiscountProps>({ source: DiscountSchema.name });
  const paymentTypes = useRealmQuery<PaymentTypeProps>({ source: PaymentTypeSchema.name });
  // console.log('initialBill', selectedBill);
  const [activeBill, setActiveBill] = useState<null | any>(route.params?.selectedBill); // TODO: type
  console.log('route.params', route.params);
  useEffect(() => {
    const selectedBill = route.params?.selectedBill;
    setActiveBill(selectedBill);

    console.log('selectedBill', selectedBill);
    // console.log('activeBill', activeBill);
    // if (selectedBill != activeBill) {
    // }
  }, [route.params]);

  const [mode, setMode] = useState<Modes>(Modes.Items);

  const clearBill = () => setActiveBill(null);
  const openDrawer = () => navigation.openDrawer();
  const onCheckout = () => setMode(Modes.Payments);

  const completeBill = bill => {
    const billBalance = balance(bill);

    if (billBalance <= 0) {
      const cashPayment = paymentTypes.find(payment => payment.name === paymentTypeNames.CASH);

      // Over tenders of any payment type are given change in cash

      // TODO: should all overtenders do this????
      // TODO: vouchers overtenders should issue new voucher not refund in cash?

      realm.write(() => {
        const changeDuePayment = realm.create(BillPaymentSchema.name, {
          _id: uuidv4(),
          paymentType: paymentTypeNames.CASH,
          paymentTypeId: cashPayment._id,
          amount: billBalance,
          isChange: true,
        });
        // push a final negative payment which represents the change due in cash to balance the payments with the sale total
        bill.payments.push(changeDuePayment);
        bill.isClosed = true;
        bill.closedAt = dayjs().toDate();
      });

      setMode(Modes.Complete);
    }
  };

  useEffect(() => {
    (!openBills || !paymentTypes || !discounts) && setMode(Modes.Loading);
    return () => {};
  }, [openBills, paymentTypes, discounts]);

  useEffect(() => {
    !activeBill ? setMode(Modes.Bills) : setMode(Modes.Items);
    return () => {};
  }, [activeBill]);

  // TODO:  function duped in drawer->bills ... refactor
  const onSelectBill = (tab, bill) => {
    console.log('onSelectBill cout', tab, bill);
    if (bill) {
      setActiveBill(bill);
    } else {
      realm.write(() => {
        const bill = realm.create(BillSchema.name, { _id: uuidv4(), tab, billPeriod });
        setActiveBill(bill);
      });
    }
  };

  const closeBill = bill => {
    clearBill();
    setMode(Modes.Bills);
  };

  const renderMainPanel = () => {
    switch (mode) {
      case Modes.Loading:
        return <Loading />;
      case Modes.Payments:
        return (
          <Payment
            activeBill={activeBill}
            discounts={discounts}
            paymentTypes={paymentTypes}
            onCompleteBill={completeBill}
          />
        );
      case Modes.Bills:
        return <SelectBill maxBills={maxBills} openBills={openBills} onSelectBill={onSelectBill} />;
      case Modes.Items:
        return <CheckoutItemNavigator activeBill={activeBill} />;
      case Modes.Complete:
        return <CompleteBill activeBill={activeBill} onCloseBill={closeBill} />;
    }
  };

  return (
    <Container>
      <SidebarHeader title="Checkout" onOpen={openDrawer} disableNav={mode === Modes.Complete} />
      <Grid>
        <Col>{renderMainPanel()}</Col>
        <Col style={{ width: 350 }}>
          {activeBill && (
            <Receipt
              activeBill={activeBill}
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

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
  CategoryProps,
} from '../../services/schemas';
import { CheckoutItemNavigator } from '../../navigators/CheckoutItemNavigator';
import { Receipt } from './sub-components/Receipt/Receipt';
import { SelectBill } from './sub-components/SelectBill/SelectBIll';
import { realm } from '../../services/Realm';
import uuidv4 from 'uuid';
import { Payments } from './sub-components/Payments/Payments';
import { balance } from '../../utils';
import { CompleteBill } from './sub-components/CompleteBill/CompleteBill';
import { BillPeriodContext } from '../../contexts/BillPeriodContext';
import dayjs from 'dayjs';
import { paymentTypeNames } from '../../api/paymentType';
import { Watermelon } from './Watermelon';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { Model, Q } from '@nozbe/watermelondb';
import { database } from '../../App';
import { CurrentBillContext } from '../../contexts/CurrentBillContext';
import { tNames } from '../../models';

export enum Modes {
  Payments = 'payments',
  Bills = 'bills',
  Items = 'items',
  Loading = 'loading',
  Complete = 'complete',
  Watermelon = 'watermelon',
}

// TODO: move to org settings
const maxBills = 40;

interface CheckoutProps {
  navigation: any; // TODO: fix
}

export const Checkout: React.FC<CheckoutProps> = ({ navigation }) => {
  // const selectedBill = route.params?.selectedBill;

  const { billPeriod } = useContext(BillPeriodContext);
  const { currentBill, setCurrentBill } = useContext(CurrentBillContext);

  // const openBills = useRealmQuery<BillProps>({ source: BillSchema.name, filter: `isClosed = false` });
  // const discounts = useRealmQuery<DiscountProps>({ source: DiscountSchema.name });
  // const paymentTypes = useRealmQuery<PaymentTypeProps>({ source: PaymentTypeSchema.name });
  // const [activeBill, setActiveBill] = useState<null | any>(route.params?.selectedBill); // TODO: type
  // console.log('route.params', route.params);
  // useEffect(() => {
  //   const selectedBill = route.params?.selectedBill;
  //   selectedBill && setActiveBill(selectedBill);

  //   console.log('selectedBill', selectedBill);
  //   // console.log('activeBill', activeBill);
  //   // if (selectedBill != activeBill) {
  //   // }
  // }, [route.params]);

  const [mode, setMode] = useState<Modes>(Modes.Items);

  const clearBill = () => setCurrentBill(null);
  const openDrawer = () => navigation.openDrawer();
  const onCheckout = () => setMode(Modes.Payments);
  const database = useDatabase();

  useEffect(() => {
    if (!currentBill) {
      setMode(Modes.Bills);
    } else {
      setMode(Modes.Items);
    }
  }, [currentBill]);

  const completeBill = async bill => {
    const billBalance = balance(bill);

    if (billBalance <= 0) {
      const cashPayment = await database.collections
        .get(tNames.paymentTypes)
        .query(Q.where('name', Q.eq(paymentTypeNames.CASH)));

      // paymentTypes.find(payment => payment.name === paymentTypeNames.CASH);

      // Over tenders of any payment type are given change in cash

      // TODO: should all overtenders do this????
      // TODO: vouchers overtenders should issue new voucher not refund in cash?

      await currentBill.addPayment({ paymentTypeId: cashPayment.id, amount: billBalance, isChange: true });

      await currentBill.close();
      // realm.write(() => {
      //   const changeDuePayment = realm.create(BillPaymentSchema.name, {
      //     _id: uuidv4(),
      //     paymentType: paymentTypeNames.CASH,
      //     paymentTypeId: cashPayment._id,
      //     amount: billBalance,
      //     isChange: true,
      //   });
      //   // push a final negative payment which represents the change due in cash to balance the payments with the sale total
      //   bill.payments.push(changeDuePayment);
      //   bill.isClosed = true;
      //   bill.closedAt = dayjs().toDate();
      // });

      setMode(Modes.Complete);
    }
  };

  // useEffect(() => {
  //   (!openBills || !paymentTypes || !discounts) && setMode(Modes.Loading);
  //   return () => {};
  // }, [openBills, paymentTypes, discounts]);

  // useEffect(() => {
  //   !activeBill ? setMode(Modes.Bills) : setMode(Modes.Items);
  //   return () => {};
  // }, [activeBill]);

  // useEffect(() => {
  //   setMode(Modes.Items);
  // }, [setMode]);

  // TODO:  function duped in drawer->bills ... refactor
  // const onSelectBill = (tab, bill) => {
  //   console.log('onSelectBill cout', tab, bill, billPeriod);
  //   if (bill) {
  //     setCurrentBill(bill);
  //   } else {
  //     realm.write(() => {
  //       const bill = realm.create(BillSchema.name, { _id: uuidv4(), tab, billPeriod });
  //       console.log('created bill', bill);
  //       setCurrentBill(bill);
  //     });
  //   }
  // };

  // const closeBill = bill => {
  //   clearBill();
  //   setMode(Modes.Bills);
  // };

  const renderMainPanel = () => {
    switch (mode) {
      case Modes.Loading:
        return <Loading />;
      case Modes.Payments:
        return <Payments bill={currentBill} onCompleteBill={completeBill} />;
      // case Modes.Watermelon:
      //   return <Watermelon />;
      case Modes.Bills:
        return <SelectBill billPeriod={billPeriod} />;
      case Modes.Items:
        return <CheckoutItemNavigator />;
      case Modes.Complete:
        return <CompleteBill currentBill={currentBill} onCloseBill={clearBill} />;
    }
  };

  console.log('currentBill', currentBill);

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

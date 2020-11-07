import withObservables from '@nozbe/with-observables';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import React, { useState } from 'react';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
import { Col, Container, Grid } from '../../core';
import { withBillPeriod } from '../../hocs/withBillPeriod';
import { Bill, BillPeriod } from '../../models';
import { SidebarDrawerStackParamList } from '../../navigators/SidebarNavigator';
import { Receipt } from '../Checkout/sub-components/Receipt/Receipt';
import { TransactionList } from './sub-components/TransactionList';

interface TransactionsOuterProps {
  navigation: DrawerNavigationProp<SidebarDrawerStackParamList, 'Transactions'>;
  billPeriod: BillPeriod;
}

interface TransactionsInnerProps {
  closedBills: any;
}

export const TransactionsInner: React.FC<TransactionsOuterProps & TransactionsInnerProps> = ({
  navigation,
  closedBills,
}) => {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const selectBillHandler = (b: Bill) => setSelectedBill(b);

  return (
    <Container>
      <SidebarHeader title="Transactions" onOpen={() => navigation.openDrawer()} />
      <Grid>
        <Col>
          <TransactionList bills={closedBills} selectedBill={selectedBill} onSelectBill={selectBillHandler} />
        </Col>
        <Col style={{ width: 350 }}>{selectedBill && <Receipt bill={selectedBill} complete={true} />}</Col>
      </Grid>
    </Container>
  );
};

const enhance = c =>
  withBillPeriod(
    withObservables<TransactionsOuterProps, TransactionsInnerProps>(['billPeriod'], ({ billPeriod }) => ({
      billPeriod,
      closedBills: billPeriod.closedBills,
    }))(c),
  );

export const Transactions = enhance(TransactionsInner);

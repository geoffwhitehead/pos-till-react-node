import React, { useState } from 'react';
import { Container, Grid, Col } from '../../core';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
import { Receipt } from '../Checkout/sub-components/Receipt/Receipt';
import { TransactionList } from './sub-components/TransactionList';
import withObservables from '@nozbe/with-observables';
import { withBillPeriod } from '../../hocs/withBillPeriod';

interface TransactionsProps {
  navigation: any; // TODO
  closedBills: any
}

export const TransactionsInner: React.FC<TransactionsProps> = ({ navigation, closedBills }) => {

  const [selectedBill, setSelectedBill] = useState<any | null>(null);
  const selectBillHandler = (bill: any) => setSelectedBill(bill);

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
    withObservables<any, any>(['billPeriod'], ({ billPeriod }) => ({
      billPeriod,
      closedBills: billPeriod.closedBills,
    }))(c),
  );

export const Transactions = enhance(TransactionsInner);

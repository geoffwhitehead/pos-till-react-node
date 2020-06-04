import React, { useState, useContext } from 'react';
import { Container, Grid, Col } from '../../core';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
import { Receipt } from '../Checkout/sub-components/Receipt/Receipt';
import { useRealmQuery } from 'react-use-realm';
import { BillProps, BillSchema } from '../../services/schemas';
import { BillPeriodContext } from '../../contexts/BillPeriodContext';
import { TransactionList } from './sub-components/TransactionList';
import { PanResponder } from 'react-native';
import withObservables from '@nozbe/with-observables';
import { withBillPeriod } from '../../hocs/withBillPeriod';

interface TransactionsProps {
  navigation: any; // TODO
  closedBills: any
}

export const TransactionsInner: React.FC<TransactionsProps> = ({ navigation, closedBills }) => {

  const [selectedBill, setSelectedBill] = useState<BillProps | null>(null);
  const selectBillHandler = (bill: BillProps) => setSelectedBill(bill);

  console.log('closedBills', closedBills);
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
    withObservables(['billPeriod'], ({ billPeriod }) => ({
      billPeriod,
      closedBills: billPeriod.closedBills,
    }))(c),
  );

export const Transactions = enhance(TransactionsInner);

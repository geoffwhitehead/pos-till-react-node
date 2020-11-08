import withObservables from '@nozbe/with-observables';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import React, { useState } from 'react';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
import { Col, Container, Content, Grid } from '../../core';
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
  closedBills: Bill[];
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
          <Content>
            <TransactionList bills={closedBills} selectedBill={selectedBill} onSelectBill={selectBillHandler} />
          </Content>
        </Col>
        {selectedBill && (
          <Col style={{ width: 350 }}>
            <Receipt bill={selectedBill} complete={true} />
          </Col>
        )}
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

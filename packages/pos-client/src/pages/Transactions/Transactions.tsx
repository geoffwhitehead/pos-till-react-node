import React, { useState, useContext } from 'react';
import { Container, Grid, Col } from '../../core';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
import { Receipt } from '../Checkout/sub-components/Receipt/Receipt';
import { useRealmQuery } from 'react-use-realm';
import { BillProps, BillSchema } from '../../services/schemas';
import { BillPeriodContext } from '../../contexts/BillPeriodContext';
import { TransactionsList } from './sub-components/TransactionsList/TransactionsList';

interface TransactionsProps {
  navigation: any; // TODO
}

export const Transactions: React.FC<TransactionsProps> = ({ navigation }) => {
  const { billPeriod, setBillPeriod } = useContext(BillPeriodContext);
  const closedBills = useRealmQuery<BillProps>({
    source: BillSchema.name,
    filter: `isClosed = true AND billPeriod._id = $0`,
    sort: [['closedAt', true]],
    variables: [billPeriod._id],
  });
  const [selectedBill, setSelectedBill] = useState<BillProps | null>(null);
  const openDrawer = () => navigation.openDrawer();
  const selectBillHandler = (bill: BillProps) => setSelectedBill(bill);

  return (
    <Container>
      <SidebarHeader title="Transactions" onOpen={openDrawer} />
      <Grid>
        <Col>
          <TransactionsList bills={closedBills} selectedBill={selectedBill} onSelectBill={selectBillHandler} />
        </Col>
        <Col style={{ width: 350 }}>{selectedBill && <Receipt activeBill={selectedBill} complete={true} />}</Col>
      </Grid>
    </Container>
  );
};

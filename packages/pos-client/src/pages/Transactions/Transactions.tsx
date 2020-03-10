import React, { useState, useContext } from 'react';
import { Text, Container, Grid, Col, List, ListItem, Left, Body, Right, Content, Badge } from '../../core';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
import { Receipt } from '../Checkout/sub-components/Receipt/Receipt';
import { useRealmQuery } from 'react-use-realm';
import { BillProps, BillSchema } from '../../services/schemas';
import { Collection } from 'realm';
import dayjs from 'dayjs';
import { total, formatNumber } from '../../utils';
import { StyleSheet } from 'react-native';
import { BillPeriodContext } from '../../contexts/BillPeriodContext';

const symbol = '£'; // TODO move
interface TransactionsProps {
  navigation: any; // TODO
}
export const Transactions: React.FC<TransactionsProps> = ({ navigation }) => {
  const { billPeriod, setBillPeriod } = useContext(BillPeriodContext);
  const closedBills = useRealmQuery<BillProps>({
    source: BillSchema.name,
    filter: `isClosed = true AND billPeriod._id = $0`,
    sort: [['timestamp', true]],
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

interface TransactionsListProps {
  bills: Collection<BillProps>;
  onSelectBill: (bill: BillProps) => void;
  selectedBill?: BillProps;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ bills, onSelectBill, selectedBill }) => {
  const selectBillFactory = (index: number) => () => onSelectBill(bills[index]);
  return (
    <Content>
      <List>
        <ListItem itemHeader>
          <Left>
            <Text>Bill / Time</Text>
          </Left>
          <Body>
            <Text>Total</Text>
          </Body>
          <Right>
            <Text>Payment Methods</Text>
          </Right>
        </ListItem>
        {bills.map((bill, index) => {
          const isSelected = selectedBill && bill._id === selectedBill._id;
          return (
            <ListItem noIndent style={isSelected && styles.selected} key={bill._id} onPress={selectBillFactory(index)}>
              <Left>
                <Badge style={{ minWidth: 28 }} success>
                  <Text>{bill.tab}</Text>
                </Badge>
                <Text>{` / ${dayjs(bill.timestamp)
                  .format('HH:mm')
                  .toString()}`}</Text>
              </Left>
              <Body>
                <Text>{formatNumber(total(bill), symbol)}</Text>
              </Body>
              <Right>
                <Text>
                  {bill.payments
                    .reduce(
                      (acc, payment) => (acc.includes(payment.paymentType) ? acc : [...acc, payment.paymentType]),
                      [],
                    )
                    .join(', ')}
                </Text>
              </Right>
            </ListItem>
          );
        })}
      </List>
    </Content>
  );
};

const styles = StyleSheet.create({
  selected: { backgroundColor: '#cde1f9' },
});

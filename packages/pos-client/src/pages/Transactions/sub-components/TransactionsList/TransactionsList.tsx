import { Content, ListItem, Left, Body, Right, Badge, Text, List } from '../../../../core';
import React from 'react';
import dayjs from 'dayjs';
import { formatNumber, total } from '../../../../utils';
import { Collection } from 'realm';
import { BillProps } from '../../../../services/schemas';
import { StyleSheet } from 'react-native';

const symbol = '£'; // TODO move

interface TransactionsListProps {
  bills: Collection<BillProps>;
  onSelectBill: (bill: BillProps) => void;
  selectedBill?: BillProps;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({ bills, onSelectBill, selectedBill }) => {
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
                <Text>{` / ${dayjs(bill.closedAt)
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

import React from 'react';
import { Text, ListItem, Left, Badge, Body, Right } from 'native-base';
import { transactionSummary, formatNumber } from '../../../utils';
import dayjs from 'dayjs';
import withObservables from '@nozbe/with-observables';
import { StyleSheet } from 'react-native';
import { capitalize } from 'lodash';

const symbol = '£'; // TODO move

const TransactionListRowInner: React.FC<{ bill: any; onSelectBill: (bill) => void; isSelected: boolean }> = ({
  isSelected,
  onSelectBill,
  bill,
  billItems,
  billModifierItems,
  billDiscounts,
  billPayments,
  paymentTypes,
}) => {
  //   console.log('billModifierItems', billModifierItems);
  //   console.log('billItems', billItems);
  //   console.log('bill', bill);
  //   console.log('billDiscounts', billDiscounts);
  //   console.log('billPayments', billPayments);
  //   console.log('paymentTypes', paymentTypes);

  console.log('bill.closedAt', bill.closedAt);
  if (!(billItems || billModifierItems || billDiscounts || billPayments)) {
    return <Text>Loading...</Text>;
  }

  const summary = transactionSummary(billItems, billModifierItems, billDiscounts, billPayments, paymentTypes);
  return (
    <ListItem noIndent style={isSelected && styles.selected} key={bill.id} onPress={() => onSelectBill(bill)}>
      <Left>
        <Badge style={{ minWidth: 28 }} success>
          <Text>{bill.reference}</Text>
        </Badge>
        <Text>{` / ${dayjs(bill.closedAt)
          .format('HH:mm')
          .toString()}`}</Text>
      </Left>
      <Body>
        <Text>{formatNumber(summary.total, symbol)}</Text>
      </Body>
      <Right>
        <Text>{summary.paymentMethods.map(capitalize).join(', ')}</Text>
      </Right>
    </ListItem>
  );
};

const enhance = withObservables(['bill'], ({ bill }) => ({
  billItems: bill.billItems,
  billDiscounts: bill.billDiscounts,
  billPayments: bill.billPayments,
  billVoids: bill.billItemVoids,
  billModifierItems: bill.billModifierItems,
}));

export const TransactionListRow = enhance(TransactionListRowInner);

const styles = StyleSheet.create({
  selected: { backgroundColor: '#cde1f9' },
});

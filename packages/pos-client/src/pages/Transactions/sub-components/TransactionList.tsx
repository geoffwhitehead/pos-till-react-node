import React from 'react';
import dayjs from 'dayjs';
import { Collection } from 'realm';
import { StyleSheet } from 'react-native';
import withObservables from '@nozbe/with-observables';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { BillProps } from '../../../services/schemas';
import { Content, ListItem, Left, List, Text, Body, Right } from 'native-base';
import { TransactionListRow } from './TransactionListRow';
import { tNames } from '../../../models';

interface TransactionListProps {
  bills: Collection<BillProps>;
  onSelectBill: (bill: any) => void;
  selectedBill?: BillProps;
  paymentTypes: any;
}

export const TransactionListInner: React.FC<TransactionListProps> = ({
  bills,
  onSelectBill,
  selectedBill,
  paymentTypes,
}) => {
  console.log('bills', bills);
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
        {bills.map(bill => {
          console.log('bill', bill);
          const isSelected = selectedBill && bill.id === selectedBill.id;
          return (
            <TransactionListRow
              paymentTypes={paymentTypes}
              bill={bill}
              isSelected={isSelected}
              onSelectBill={onSelectBill}
            />
          );
        })}
      </List>
    </Content>
  );
};

const enhance = c =>
  withDatabase(
    withObservables([], ({ database }) => ({
      paymentTypes: database.collections
        .get(tNames.paymentTypes)
        .query()
        .fetch(),
    }))(c),
  );
export const TransactionList = enhance(TransactionListInner);

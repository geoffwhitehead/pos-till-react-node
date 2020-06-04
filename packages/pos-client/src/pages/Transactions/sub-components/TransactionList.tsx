import React from 'react';
import dayjs from 'dayjs';
import withObservables from '@nozbe/with-observables';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { BillProps } from '../../../services/schemas';
import { Content, ListItem, Left, List, Text, Body, Right } from '../../../core';
import { TransactionListRow } from './TransactionListRow';
import { tNames } from '../../../models';

interface TransactionListProps {
  bills: BillProps[];
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
  const sorterClosedAtDescending = (bill1, bill2) =>
    dayjs(bill1.closedAt).isBefore(bill2.closedAt) ? 1 : dayjs(bill1.closedAt).isAfter(bill2.closedAt) ? -1 : 0;

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
        {bills.sort(sorterClosedAtDescending).map(bill => {
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

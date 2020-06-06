import React from 'react';
import withObservables from '@nozbe/with-observables';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { Content, ListItem, Left, List, Text, Body, Right } from '../../../core';
import { TransactionListRow } from './TransactionListRow';
import { tableNames } from '../../../models';

interface TransactionListProps {
  bills: any[];
  onSelectBill: (bill: any) => void;
  selectedBill?: any;
  paymentTypes: any;
}

export const TransactionListInner: React.FC<TransactionListProps> = ({
  bills,
  onSelectBill,
  selectedBill,
  paymentTypes,
}) => {
  const sorterClosedAtDescending = (bill1, bill2) => bill2.closedAt - bill1.closedAt;

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
    withObservables<any, any>([], ({ database }) => ({
      paymentTypes: database.collections
        .get(tableNames.paymentTypes)
        .query()
    }))(c),
  );
export const TransactionList = enhance(TransactionListInner);

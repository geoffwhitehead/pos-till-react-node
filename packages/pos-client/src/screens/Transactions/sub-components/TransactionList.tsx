import React from 'react';
import withObservables from '@nozbe/with-observables';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { Content, ListItem, Left, List, Text, Body, Right } from '../../../core';
import { TransactionListRow } from './TransactionListRow';
import { tableNames, Bill, PaymentType } from '../../../models';
import { Database } from '@nozbe/watermelondb';

interface TransactionListInnerProps {
  paymentTypes: any;
}

interface TransactionListOuterProps {
  bills: Bill[];
  onSelectBill: (b: Bill) => void;
  selectedBill?: Bill;
  database: Database
}

export const TransactionListInner: React.FC<TransactionListOuterProps & TransactionListInnerProps> = ({
  bills,
  onSelectBill,
  selectedBill,
  paymentTypes,
}) => {
  const sorterClosedAtDescending = (b1: Bill, b2: Bill) => b2.closedAt - b1.closedAt;

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

// TODO: type
const enhance = c =>
  withDatabase<any>(
    withObservables<TransactionListOuterProps, TransactionListInnerProps>([], ({ database }) => ({
      paymentTypes: database.collections.get<PaymentType>(tableNames.paymentTypes).query(),
    }))(c),
  );

export const TransactionList = enhance(TransactionListInner);

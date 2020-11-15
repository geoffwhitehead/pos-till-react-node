import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { groupBy } from 'lodash';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, Left, List, ListItem, Right, Text } from '../../../core';
import { Bill, PaymentType, tableNames } from '../../../models';
import { TransactionListRow } from './TransactionListRow';

interface TransactionListInnerProps {
  paymentTypes: PaymentType[];
}

interface TransactionListOuterProps {
  bills: Bill[];
  onSelectBill: (bill: Bill) => void;
  selectedBill?: Bill;
  database: Database;
}

export const TransactionListInner: React.FC<TransactionListOuterProps & TransactionListInnerProps> = ({
  bills,
  onSelectBill,
  selectedBill,
  paymentTypes,
}) => {
  const sorterClosedAtDescending = (b1: Bill, b2: Bill) => b2.closedAt - b1.closedAt;
  const sorterClosedAtAscending = (b1: Bill, b2: Bill) => b1.closedAt - b2.closedAt;
  const [isGroupedByTable, setIsGroupedByTable] = useState(false);
  const [isOrderedDescending, setIsOrderedDescending] = useState(true);

  const sorter = isOrderedDescending ? sorterClosedAtDescending : sorterClosedAtAscending;
  const sortedBills = bills.sort(sorter);
  const sortedBillsGrouped = groupBy(sortedBills, bill => bill.reference);
  const hasNoTransactions = bills.length === 0;

  return (
    <List>
      <ListItem>
        <Left></Left>
        <Right
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            style={{ marginRight: 5 }}
            active={isGroupedByTable}
            small
            info
            onPress={() => setIsOrderedDescending(!isOrderedDescending)}
          >
            <Text>{isOrderedDescending ? 'Descending' : 'Ascending'}</Text>
          </Button>
          <Button active={isGroupedByTable} small info onPress={() => setIsGroupedByTable(!isGroupedByTable)}>
            <Text>Grouped</Text>
          </Button>
        </Right>
      </ListItem>

      {hasNoTransactions ? (
        <Text style={{ padding: 15 }}>There aren't any completed transactions ...</Text>
      ) : isGroupedByTable ? (
        <ScrollView>
          {Object.entries(sortedBillsGrouped).map(([billReference, sortedBillsByReference]) => {
            return [
              <ListItem key={`${billReference}-seperator`} itemDivider>
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{`Bill: ${billReference}`}</Text>
              </ListItem>,
              ...sortedBillsByReference.map(bill => {
                const isSelected = selectedBill && bill.id === selectedBill.id;

                return (
                  <TransactionListRow
                    key={bill.id}
                    paymentTypes={paymentTypes}
                    bill={bill}
                    isSelected={isSelected}
                    onSelectBill={onSelectBill}
                    showBillRef={false}
                  />
                );
              }),
            ];
          })}
        </ScrollView>
      ) : (
        <ScrollView>
          {sortedBills.map(bill => {
            const isSelected = selectedBill && bill.id === selectedBill.id;
            return (
              <TransactionListRow
                key={bill.id}
                paymentTypes={paymentTypes}
                bill={bill}
                isSelected={isSelected}
                onSelectBill={onSelectBill}
              />
            );
          })}
        </ScrollView>
      )}
    </List>
  );
};

const enhance = c =>
  withDatabase(
    withObservables<TransactionListOuterProps, TransactionListInnerProps>([], ({ database }) => ({
      paymentTypes: database.collections.get<PaymentType>(tableNames.paymentTypes).query(),
    }))(c),
  );

export const TransactionList = enhance(TransactionListInner);

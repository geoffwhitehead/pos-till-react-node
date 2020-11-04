import React, { useState } from 'react';
import withObservables from '@nozbe/with-observables';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { Content, ListItem, Left, List, Text, Body, Right, Button } from '../../../core';
import { TransactionListRow } from './TransactionListRow';
import { tableNames, Bill, PaymentType } from '../../../models';
import { Database } from '@nozbe/watermelondb';
import { groupBy } from 'lodash';

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

  return (
    <Content>
      <List>
        <ListItem itemHeader>
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
        {isGroupedByTable
          ? Object.entries(sortedBillsGrouped).map(([billReference, sortedBillsByReference]) => {
              return [
                <ListItem itemDivider>
                  <Text style={{ fontWeight: 'bold', fontSize: 22 }}>{`Table: ${billReference}`}</Text>
                </ListItem>,
                ...sortedBillsByReference.map(bill => {
                  const isSelected = selectedBill && bill.id === selectedBill.id;

                  return (
                    <TransactionListRow
                      paymentTypes={paymentTypes}
                      bill={bill}
                      isSelected={isSelected}
                      onSelectBill={onSelectBill}
                      showBillRef={false}
                    />
                  );
                }),
              ];
            })
          : sortedBills.map(bill => {
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

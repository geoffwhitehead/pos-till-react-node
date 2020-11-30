import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { groupBy } from 'lodash';
import React, { useContext } from 'react';
import { ScrollView } from 'react-native';
import { SwitchSelector } from '../../../components/SwitchSelector/SwitchSelector';
import { OrganizationContext } from '../../../contexts/OrganizationContext';
import { Left, List, ListItem, Right, Text } from '../../../core';
import { database } from '../../../database';
import { Bill, PaymentType, tableNames } from '../../../models';
import { TransactionGroupingEnum, TransactionOrderEnum } from '../../../models/Organization';
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
  const { organization } = useContext(OrganizationContext);

  const sorterClosedAtDescending = (b1: Bill, b2: Bill) => b2.closedAt - b1.closedAt;
  const sorterClosedAtAscending = (b1: Bill, b2: Bill) => b1.closedAt - b2.closedAt;

  const sorter =
    organization.transactionOrder === TransactionOrderEnum.descending
      ? sorterClosedAtDescending
      : sorterClosedAtAscending;

  const sortedBills = bills.sort(sorter);
  const sortedBillsGrouped = groupBy(sortedBills, bill => bill.reference);
  const hasNoTransactions = bills.length === 0;

  const isGrouped = organization.transactionGrouping === TransactionGroupingEnum.grouped;

  const updateOrganization = async value => {
    await database.action(() => organization.update(record => Object.assign(record, value)));
  };

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
          <SwitchSelector
            options={[
              { label: 'Descending', value: TransactionOrderEnum.descending },
              { label: 'Ascending', value: TransactionOrderEnum.ascending },
            ]}
            initial={organization.transactionOrder}
            onPress={value => updateOrganization({ transactionOrder: value })}
            style={{ paddingRight: 10 }}
          />

          <SwitchSelector
            options={[
              { label: 'Ungrouped', value: TransactionGroupingEnum.ungrouped },
              { label: 'Grouped', value: TransactionGroupingEnum.grouped },
            ]}
            initial={organization.transactionGrouping}
            onPress={value => updateOrganization({ transactionGrouping: value })}
          />
        </Right>
      </ListItem>

      {hasNoTransactions ? (
        <Text style={{ padding: 15 }}>There aren't any completed transactions ...</Text>
      ) : isGrouped ? (
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

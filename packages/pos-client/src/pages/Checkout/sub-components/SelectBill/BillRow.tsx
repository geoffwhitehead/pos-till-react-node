import React, { useState, useEffect, Suspense } from 'react';
import { ListItem, Left, Text, Body, Right } from 'native-base';
import { formatNumber, balance, _total, billSummary, BillSummary } from '../../../../utils';
import withObservables from '@nozbe/with-observables';
import { useObservableSuspense } from 'observable-hooks';
import { from } from 'rxjs';
import { Button } from '../../../../core';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { tNames } from '../../../../models';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';

const symbol = '£'; // TODO: move to org settings

interface BillRowProps {
  bill: any;
  onSelectBill: (bill: any) => void;
  billPayments: any;
  billDiscounts: any;
  billItems: any;
  discounts: any;
}
export const WrappedBillRow: React.FC<BillRowProps> = ({
  bill,
  onSelectBill,
  billItems,
  billPayments,
  billDiscounts,
  discounts,
}) => {
  const _onSelectBill = () => onSelectBill(bill);
  const [summary, setSummary] = useState<BillSummary>();

  useEffect(() => {
    const summary = async () => {
      const summary = await billSummary(billItems, billDiscounts, billPayments, discounts);
      setSummary(summary);
    };
    summary();
  }, [billItems]);

  return (
    <ListItem onPress={_onSelectBill}>
      <Left>
        <Text style={{ color: 'green' }}>{`${bill.reference}: Open`}</Text>
      </Left>
      <Body>
        <Text style={{ color: 'grey' }}>{summary ? formatNumber(summary.balance, symbol) : '...'}</Text>
      </Body>
      <Right>
        <Text style={{ color: 'grey' }}>{summary ? formatNumber(summary.total, symbol) : '...'}</Text>
      </Right>
    </ListItem>
  );
};

const enhance = component =>
  withDatabase<any>( // TODO: fix
    withObservables(['bill'], ({ database, bill }) => ({
      bill,
      billPayments: bill.billPayments,
      billDiscounts: bill.billDiscounts,
      billItems: bill.billItems,
      discounts: database.collections
        .get(tNames.discounts)
        .query()
    }))(component),
  );

// const enhance = withObservables(['bill'], ({ bill, database }) => ({
//   b: database.collections.get(tNames.bills).findAndObserve(bill.id),
// }));

export const BillRow = enhance(WrappedBillRow);

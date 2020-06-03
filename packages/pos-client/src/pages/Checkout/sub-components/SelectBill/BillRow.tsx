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
  const database = useDatabase();
  // console.log('*************');
  // console.log('re render');
  // console.log('total', total);

  // console.log('*************');

  // console.log('payments', payments);
  // console.log('discounts', discounts);
  // console.log('items', items);
  // const x = await _total(items, discounts, payments);
  // const itemsCount = items.length;
  // console.log('itemsCount', itemsCount);
  useEffect(() => {
    const summary = async () => {
      const summary = await billSummary(billItems, billDiscounts, billPayments, discounts);
      setSummary(summary);
    };
    summary();
  }, [billItems]);

  const a = async () => {
    const allItems = await database.collections
      .get(tNames.items)
      .query()
      .fetch();
    const priceGroups = await database.collections
      .get(tNames.priceGroups)
      .query()
      .fetch();
    // console.log('items', allItems);
    // console.log('items[0]', allItems[0]);
    // console.log('priceGroups', priceGroups);
    await bill.addItem({ item: allItems[0], priceGroup: priceGroups[0] });
    // console.log('DONE');
  };
  // const l = from();
  // const t = useObservableSuspense(l);
  return (
    <ListItem onPress={_onSelectBill}>
      <Left>
        <Text style={{ color: 'green' }}>{`${bill.reference}: Open`}</Text>
      </Left>
      {/* <Body>
        <Button onPress={a}>
          <Text>Add item</Text>
        </Button>
      </Body> */}
      <Body>
        <Text style={{ color: 'grey' }}>{summary ? formatNumber(summary.balance, symbol) : '...'}</Text>
      </Body>
      <Right>
        <Text style={{ color: 'grey' }}>{summary ? formatNumber(summary.total, symbol) : '...'}</Text>
      </Right>
    </ListItem>
  );
};

// const Value = ({ items, discounts, payments }) => {
//   const total = useObservableSuspense(from(_total(items, discounts, payments)));
//   return <Text style={{ color: 'grey' }}>{formatNumber(total, symbol)}</Text>;
// };
// const enhanceT = withObservables(['items'], ({ items }) => {
//   console.log('------- items', items);
//   return {
//     modifierItems: items.map(async i => await i.billItemModifierItems.fetch()),
//   };
// });

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
        .fetch(),
    }))(component),
  );

// const enhance = withObservables(['bill'], ({ bill, database }) => ({
//   b: database.collections.get(tNames.bills).findAndObserve(bill.id),
// }));

export const BillRow = enhance(WrappedBillRow);

import React, { useState, useEffect, Suspense } from 'react';
import { ListItem, Left, Text, Body, Right } from 'native-base';
import { formatNumber, balance, _total } from '../../../../utils';
import withObservables from '@nozbe/with-observables';
import { useObservableSuspense } from 'observable-hooks';
import { from } from 'rxjs';
import { Button } from '../../../../core';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { tNames } from '../../../../models';

const symbol = '£'; // TODO: move to org settings

interface BillRowProps {
  bill: any;
  onSelectBill: (bill: any) => void;
  payments: any;
  discounts: any;
  items: any;
}
export const WrappedBillRow: React.FC<BillRowProps> = ({
  bill,
  onSelectBill,
  items,
  payments,
  discounts,
}) => {
  const _onSelectBill = () => onSelectBill(bill);
  const [total, setTotal] = useState(null);
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
    console.log('use effect trigger');
    const total = async () => {
      const t = await _total(items, discounts, payments);
      setTotal(t);
    };
    total();
  }, [items]);

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
      <Body>
        <Button onPress={a}>
          <Text>Add item</Text>
        </Button>
      </Body>
      {/* <Body><Text style={{ color: 'grey' }}>{formatNumber(balance(bill), symbol)}</Text></Body> */}
      <Right>
        <Suspense fallback={<Text>...</Text>}>
          <Text style={{ color: 'grey' }}>{total && formatNumber(total, symbol)}</Text>
        </Suspense>
        {/* <Suspense fallback={<Text>...</Text>}>
          <Value items={items} discounts={discounts} payments={payments} />
        </Suspense> */}
      </Right>
    </ListItem>
  );
};

// const Value = ({ items, discounts, payments }) => {
//   const total = useObservableSuspense(from(_total(items, discounts, payments)));
//   return <Text style={{ color: 'grey' }}>{formatNumber(total, symbol)}</Text>;
// };

const enhance = withObservables(['bill, items, discounts'], ({ bill }) => ({
  bill,
  payments: bill.billPayments,
  discounts: bill.billDiscounts,
  items: bill.billItems,
}));

// const enhance = withObservables(['bill'], ({ bill, database }) => ({
//   b: database.collections.get(tNames.bills).findAndObserve(bill.id),
// }));

export const BillRow = enhance(WrappedBillRow);

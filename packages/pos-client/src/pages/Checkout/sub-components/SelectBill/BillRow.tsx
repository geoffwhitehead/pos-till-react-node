import React, { useState, useEffect } from 'react';
import { ListItem, Left, Text, Body, Right } from 'native-base';
import { formatNumber, balance, _total } from '../../../../utils';
import withObservables from '@nozbe/with-observables';
import { useObservableSuspense } from 'observable-hooks';
import { from } from 'rxjs';

const symbol = '£'; // TODO: move to org settings

interface BillRowProps {
  bill: any;
  onSelectBill: (bill: any) => void;
  payments: any;
  discounts: any;
  items: any;
}
export const WrappedBillRow: React.FC<BillRowProps> = ({ bill, onSelectBill, items, payments, discounts }) => {
  const _onSelectBill = () => onSelectBill(bill);

  // console.log('payments', payments);
  // console.log('discounts', discounts);
  // console.log('items', items);
  const x = await _total(items, discounts, payments);
  const [total, setTotal] = useState(null);

  useEffect(() => {
    const total = async () => {
      const t = await _total(items, discounts, payments);
      setTotal(t);
    };
    total();
  }, ['bill', 'items', 'discounts', 'setTotal']);

  const l = from(_total(items, discounts, payments))
  const t = useObservableSuspense(l);
  return (
    <ListItem onPress={_onSelectBill}>
      <Left>
        <Text style={{ color: 'green' }}>{`${bill.reference}: Open`}</Text>
      </Left>
      {/* <Body><Text style={{ color: 'grey' }}>{formatNumber(balance(bill), symbol)}</Text></Body> */}
      <Right>
        {/* <Text style={{ color: 'grey' }}>{total && formatNumber(total, symbol)}</Text> */}
        <Text style={{ color: 'grey' }}>{formatNumber(total, symbol)}</Text>
      </Right>
    </ListItem>
  );
};

export const BillRow = withObservables(['bill'], ({ bill }) => ({
  bill,
  payments: bill.billPayments,
  discounts: bill.billDiscounts,
  items: bill.billItems,
}))(WrappedBillRow);

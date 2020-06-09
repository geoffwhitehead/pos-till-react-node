import React, { useState, useEffect } from 'react';
import { ListItem, Left, Text, Body, Right, Icon } from '../../../../core';
import { formatNumber, _total, billSummary, BillSummary } from '../../../../utils';
import withObservables from '@nozbe/with-observables';
import { tableNames, Bill, Discount } from '../../../../models';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { Database } from '@nozbe/watermelondb';

const symbol = '£'; // TODO: move to org settings

interface BillRowInnerProps {
  billPayments: any;
  billDiscounts: any;
  billItems: any;
  discounts: any;
}

interface BillRowOuterProps {
  bill: Bill;
  onSelectBill: (bill: Bill) => void;
  database: Database;
}

export const WrappedBillRow: React.FC<BillRowInnerProps & BillRowOuterProps> = ({
  bill,
  onSelectBill,
  billItems,
  billPayments,
  billDiscounts,
  discounts,
}) => {
  const [summary, setSummary] = useState<BillSummary>();

  useEffect(() => {
    const summary = async () => {
      const summary = await billSummary(billItems, billDiscounts, billPayments, discounts);
      setSummary(summary);
    };
    summary();
  }, [billItems]);

  const renderPrintErrors = () => {
    const hasUnstoredItems = billItems.some(bI => bI.printStatus === '');
    const hasPrintErrors = billItems.some(bI => bI.printStatus === 'error');

    if (hasPrintErrors) {
      return [
        <Icon active name="ios-warning" style={{ marginLeft: 20, marginRight: 2, color: 'grey' }} />,
        <Text note>Print Error</Text>,
      ];
    }
    if (hasUnstoredItems) {
      return [
        <Icon active name="ios-warning" style={{ marginLeft: 20, marginRight: 2, color: 'grey' }} />,
        <Text note>Unsent Items</Text>,
      ];
    }
    return null;
  };
  return (
    <ListItem onPress={() => onSelectBill(bill)}>
      <Left>
        <Text style={{ color: 'green' }}>{`${bill.reference}: Open`}</Text>
        {renderPrintErrors()}
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
    withObservables<BillRowOuterProps, BillRowInnerProps>(['bill'], ({ database, bill }) => ({
      bill,
      billPayments: bill.billPayments,
      billDiscounts: bill.billDiscounts,
      billItems: bill.billItems,
      discounts: database.collections.get<Discount>(tableNames.discounts).query(),
    }))(component),
  );

export const BillRow = enhance(WrappedBillRow);

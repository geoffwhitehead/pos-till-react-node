import React, { useState, useEffect, useContext } from 'react';
import { ListItem, Left, Text, Body, Right, Icon } from '../../../../core';
import { formatNumber, _total, billSummary, BillSummary } from '../../../../utils';
import withObservables from '@nozbe/with-observables';
import { tableNames, Bill, Discount, BillItem, BillDiscount, BillPayment, BillItemPrintLog } from '../../../../models';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { Database } from '@nozbe/watermelondb';
import { OrganizationContext } from '../../../../contexts/OrganizationContext';
import { PrintStatus } from '../../../../models/BillItemPrintLog';

interface BillRowInnerProps {
  billPayments: BillPayment[];
  billDiscounts: BillDiscount[];
  billItems: BillItem[];
  // billItemsIncPendingVoids: BillItem[];
  discounts: Discount[];
  // billItemsVoidsStatusUnstoredCount: number;
  // billItemsVoidsStatusErrorsCount: number;
  // billItemsVoidsStatusPendingCount: number;
  overviewPrintLogs: BillItemPrintLog[];
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
  // billItemsIncPendingVoids,
  // billItemsVoidsStatusUnstoredCount,
  // billItemsVoidsStatusErrorsCount,
  // billItemsVoidsStatusPendingCount,
  billPayments,
  billDiscounts,
  discounts,
  overviewPrintLogs,
}) => {
  const [summary, setSummary] = useState<BillSummary>();
  const {
    organization: { currency },
  } = useContext(OrganizationContext);

  useEffect(() => {
    const summary = async () => {
      const summary = await billSummary(billItems, billDiscounts, billPayments, discounts); // TODO: change to minimal
      setSummary(summary);
    };
    summary();
  }, [billItems]);

  const hasUnstoredItems = overviewPrintLogs.some(l => l.status === PrintStatus.pending);
  const hasPrintErrors = overviewPrintLogs.some(l => l.status === PrintStatus.errored);
  const hasPendingPrints = overviewPrintLogs.some(l => l.status === PrintStatus.processing);

  return (
    <ListItem key={bill.id} onPress={() => onSelectBill(bill)}>
      {hasPrintErrors && (
        <Left>
          <Text style={{ color: 'green' }}>{`${bill.reference}: Open`}</Text>
          <Icon active name="ios-warning" style={{ marginLeft: 20, marginRight: 2, color: 'grey' }} />
          <Text note>Print Error</Text>
        </Left>
      )}

      {!hasPrintErrors && hasUnstoredItems && (
        <Left>
          <Text style={{ color: 'green' }}>{`${bill.reference}: Open`}</Text>
          <Icon active name="ios-warning" style={{ marginLeft: 20, marginRight: 2, color: 'grey' }} />
          <Text note>Unsent Items</Text>
        </Left>
      )}

      {!hasPrintErrors && !hasUnstoredItems && hasPendingPrints && (
        <Left>
          <Text style={{ color: 'green' }}>{`${bill.reference}: Open`}</Text>
          <Icon active name="ios-print" style={{ marginLeft: 20, marginRight: 2, color: 'grey' }} />
          <Text note>Printing</Text>
        </Left>
      )}

      {!hasPrintErrors && !hasUnstoredItems && !hasPendingPrints && (
        <Left>
          <Text style={{ color: 'green' }}>{`${bill.reference}: Open`}</Text>
        </Left>
      )}

      <Body>
        <Text style={{ color: 'grey' }}>{summary ? formatNumber(summary.balance, currency) : '...'}</Text>
      </Body>
      <Right>
        <Text style={{ color: 'grey' }}>{summary ? formatNumber(summary.total, currency) : '...'}</Text>
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
      // billItemsIncPendingVoids: bill.billItemsIncPendingVoids,
      // billItemsVoidsStatusUnstoredCount: bill.billItemsVoidsStatusUnstored.observeCount(),
      // billItemsVoidsStatusErrorsCount: bill.billItemsVoidsStatusErrors.observeCount(),
      // billItemsVoidsStatusPendingCount: bill.billItemsVoidsStatusPending.observeCount(),
      discounts: database.collections.get<Discount>(tableNames.discounts).query(),
      overviewPrintLogs: bill.overviewPrintLogs.observeWithColumns(['status']),
    }))(component),
  );

export const BillRow = enhance(WrappedBillRow);

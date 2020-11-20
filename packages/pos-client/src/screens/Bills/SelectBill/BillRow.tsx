import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { OrganizationContext } from '../../../contexts/OrganizationContext';
import { Body, Icon, Left, ListItem, Right, Text, View } from '../../../core';
import {
  Bill,
  BillCallPrintLog,
  BillDiscount,
  BillItem,
  BillItemPrintLog,
  BillPayment,
  Discount,
  tableNames,
} from '../../../models';
import { PrintStatus } from '../../../models/BillItemPrintLog';
import { formatNumber, minimalBillSummary, MinimalBillSummary } from '../../../utils';

interface BillRowInnerProps {
  billPayments: BillPayment[];
  billDiscounts: BillDiscount[];
  chargableBillItems: BillItem[];
  discounts: Discount[];
  overviewPrintLogs: BillItemPrintLog[];
  overviewBillCallPrintLogs: BillCallPrintLog[];
}

interface BillRowOuterProps {
  bill: Bill;
  onSelectBill: (bill: Bill) => void;
  database: Database;
}

export const WrappedBillRow: React.FC<BillRowInnerProps & BillRowOuterProps> = ({
  bill,
  onSelectBill,
  chargableBillItems,
  billPayments,
  billDiscounts,
  discounts,
  overviewPrintLogs,
  database,
  overviewBillCallPrintLogs,
}) => {
  const [summary, setSummary] = useState<MinimalBillSummary>();
  const {
    organization: { currency },
  } = useContext(OrganizationContext);

  useEffect(() => {
    const summary = async () => {
      const summary = await minimalBillSummary({
        chargableBillItems,
        billDiscounts,
        billPayments,
        discounts,
        database,
      });
      setSummary(summary);
    };
    summary();
  }, [chargableBillItems, billDiscounts, billPayments, discounts]);

  const combinedLogs = [...overviewPrintLogs, ...overviewBillCallPrintLogs];
  const hasUnstoredItems = combinedLogs.some(l => l.status === PrintStatus.pending);
  const hasPrintErrors = combinedLogs.some(l => l.status === PrintStatus.errored);
  const hasPendingPrints = combinedLogs.some(l => l.status === PrintStatus.processing);
  const rowText = bill.reference;

  // const balanceText = summary ? `Balance: ${formatNumber(summary.balance, currency)}` : '...';
  const totalText = summary ? `${formatNumber(summary.totalPayable, currency)}` : '...';

  const hasUnsentItems = !hasPrintErrors && hasUnstoredItems;
  const hasPendingPrintItems = !hasPrintErrors && !hasUnstoredItems && hasPendingPrints;
  const text = hasPrintErrors
    ? 'Print Error'
    : hasUnsentItems
    ? 'Unsent Items'
    : hasPendingPrintItems
    ? 'Printing'
    : null;
  const iconName = hasPrintErrors
    ? 'ios-warning'
    : hasUnsentItems
    ? 'ios-warning'
    : hasPendingPrintItems
    ? 'ios-print'
    : null;

  return (
    <ListItem noIndent style={styles.openBill} key={bill.id} onPress={() => onSelectBill(bill)}>
      <Left>
        <View>
          <Text style={styles.rowText}>{rowText}</Text>
          <Text note>{`Opened: ${dayjs(bill.createdAt).format('h:mm a')}`}</Text>
        </View>
      </Left>

      <Body>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {iconName && <Icon active name={iconName} style={styles.iconStyle} />}
          {text && <Text note>{text}</Text>}
        </View>
      </Body>
      <Right>
        <Text style={styles.totalText}>{totalText}</Text>
      </Right>
    </ListItem>
  );
};

const enhance = component =>
  withDatabase(
    withObservables<BillRowOuterProps, BillRowInnerProps>(['bill'], ({ database, bill }) => ({
      bill,
      billPayments: bill.billPayments,
      billDiscounts: bill.billDiscounts,
      chargableBillItems: bill.chargableBillItems,
      discounts: database.collections.get<Discount>(tableNames.discounts).query(),
      overviewPrintLogs: bill.overviewPrintLogs.observeWithColumns(['status']),
      overviewBillCallPrintLogs: bill.overviewBillCallPrintLogs.observeWithColumns(['status']),
    }))(component),
  );

export const BillRow = enhance(WrappedBillRow);

const styles = {
  openBill: {
    borderLeftColor: 'green',
    borderLeftWidth: 8,
  },
  rowText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  dateText: {
    // { color: 'grey', fontSize: 22 }
  },
  iconStyle: { marginRight: 5, color: 'grey' },
  totalText: { color: 'grey', fontWeight: 'bold', fontSize: 18 },
} as const;

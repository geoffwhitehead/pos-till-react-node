import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import dayjs, { Dayjs } from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { OrganizationContext } from '../../../contexts/OrganizationContext';
import { Badge, Left, ListItem, Right, Text, View } from '../../../core';
import {
  Bill,
  BillCallLog,
  BillCallPrintLog,
  BillDiscount,
  BillItem,
  BillItemPrintLog,
  BillPayment,
  Discount,
  tableNames,
} from '../../../models';
import { PrintStatus } from '../../../models/BillItemPrintLog';
import { fontSizes } from '../../../theme';
import { formatNumber, minimalBillSummary, MinimalBillSummary } from '../../../utils';
import { moderateScale } from '../../../utils/scaling';

interface BillRowInnerProps {
  billPayments: BillPayment[];
  billDiscounts: BillDiscount[];
  chargableBillItems: BillItem[];
  discounts: Discount[];
  overviewPrintLogs: BillItemPrintLog[];
  overviewBillCallPrintLogs: BillCallPrintLog[];
  billCallLogs: BillCallLog[];
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
  billCallLogs,
}) => {
  const [summary, setSummary] = useState<MinimalBillSummary>();
  const {
    organization: { currency },
  } = useContext(OrganizationContext);
  const [lastCalledAt, setLastCalledAt] = useState<Dayjs>();
  const [hasUnstoredItems, setHasUnstoredItems] = useState(false);
  const [hasPrintErrors, sethasPrintErrors] = useState(false);
  const [hasPendingPrints, setHasPendingPrints] = useState(false);

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

  useEffect(() => {
    const lastCalledAt =
      billCallLogs.length > 0 &&
      billCallLogs.reduce((out, log) => {
        const date = dayjs(log.createdAt);
        if (date.isAfter(out)) {
          return date;
        }
        return out;
      }, dayjs(billCallLogs[0].createdAt));

    setLastCalledAt(lastCalledAt);
  }, [billCallLogs]);

  useEffect(() => {
    const combinedLogs = [...overviewPrintLogs, ...overviewBillCallPrintLogs];
    const hasUnstoredItems = combinedLogs.some(l => l.status === PrintStatus.pending);
    setHasUnstoredItems(hasUnstoredItems);
  }, [overviewPrintLogs, overviewBillCallPrintLogs]);

  useEffect(() => {
    const combinedLogs = [...overviewPrintLogs, ...overviewBillCallPrintLogs];
    const hasPrintErrors = combinedLogs.some(l => l.status === PrintStatus.errored);

    sethasPrintErrors(hasPrintErrors);
  }, [overviewPrintLogs, overviewBillCallPrintLogs]);

  useEffect(() => {
    const combinedLogs = [...overviewPrintLogs, ...overviewBillCallPrintLogs];
    const hasPendingPrints = combinedLogs.some(l => l.status === PrintStatus.processing);

    setHasPendingPrints(hasPendingPrints);
  }, [overviewPrintLogs, overviewBillCallPrintLogs]);

  const rowText = bill.reference;

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
  const badgeType = hasPrintErrors ? 'danger' : hasUnsentItems ? 'warning' : hasPendingPrintItems ? 'info' : null;

  return (
    <ListItem noIndent style={styles.openBill} key={bill.id} onPress={() => onSelectBill(bill)}>
      <Left>
        <Text style={styles.rowText}>{rowText}</Text>
        <View>
          {badgeType && (
            <Badge {...{ badgeType }} style={{ marginBottom: 5 }}>
              <Text note style={{ color: 'white' }}>
                {text}
              </Text>
            </Badge>
          )}
          <Text note>{`Opened: ${dayjs(bill.createdAt).format('h:mm a')}`}</Text>
          <Text note>{`Last Called: ${lastCalledAt ? lastCalledAt.format('h:mm a') : ''}`}</Text>
        </View>
      </Left>

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
      billCallLogs: bill.billCallLogs,
    }))(component),
  );

export const BillRow = enhance(WrappedBillRow);

const styles = StyleSheet.create({
  openBill: {
    borderLeftColor: 'green',
    borderLeftWidth: 8,
  },
  rowText: {
    fontWeight: 'bold',
    fontSize: fontSizes[3],
    paddingRight: moderateScale(15),
  },
  iconStyle: { marginRight: 5, color: 'grey' },
  totalText: { color: 'grey', fontWeight: 'bold', fontSize: fontSizes[3] },
} as const);

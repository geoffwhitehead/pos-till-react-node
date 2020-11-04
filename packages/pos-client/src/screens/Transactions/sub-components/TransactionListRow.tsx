import React, { useContext, useEffect, useState } from 'react';
import { Text, ListItem, Left, Badge, Body, Right } from 'native-base';
import { transactionSummary, formatNumber, minimalBillSummary, TransactionSummary } from '../../../utils';
import dayjs from 'dayjs';
import withObservables from '@nozbe/with-observables';
import { StyleSheet, View } from 'react-native';
import { capitalize, keyBy } from 'lodash';
import { Bill, BillDiscount, BillItem, BillPayment, PaymentType } from '../../../models';
import { OrganizationContext } from '../../../contexts/OrganizationContext';
import { useDatabase } from '@nozbe/watermelondb/hooks';

interface TransactionListRowOuterProps {
  bill: Bill;
  onSelectBill: (bill: Bill) => void;
  isSelected: boolean;
  showBillRef?: boolean;
  paymentTypes: PaymentType[];
}

interface TransactionListRowInnerProps {
  chargableBillItems: BillItem[];
  billDiscounts: BillDiscount[];
  billPayments: BillPayment[];
}

const TransactionListRowInner: React.FC<TransactionListRowOuterProps & TransactionListRowInnerProps> = ({
  isSelected,
  onSelectBill,
  bill,
  chargableBillItems,
  billDiscounts,
  billPayments,
  paymentTypes,
  showBillRef = true,
}) => {
  const {
    organization: { currency },
  } = useContext(OrganizationContext);

  const [summary, setSummary] = useState<TransactionSummary>();
  const database = useDatabase();

  useEffect(() => {
    const fetchSummary = async () => {
      const summary = await transactionSummary({ chargableBillItems, billDiscounts, billPayments, database });
      setSummary(summary);
    };
    fetchSummary();
  }, [chargableBillItems, billDiscounts, billPayments]);
  if (!summary) {
    return <Text>Loading...</Text>;
  }

  const keyedPaymentTypes = keyBy(paymentTypes, type => type.id);
  const hasDiscount = summary.discountTotal > 0;

  return (
    <ListItem noIndent style={isSelected && styles.selected} key={bill.id} onPress={() => onSelectBill(bill)}>
      <Left
        style={{
          flexDirection: 'column',
        }}
      >
        {showBillRef && (
          <Text
            style={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 22 }}
          >{`Table: ${bill.reference}`}</Text>
        )}
        <Text style={{ alignSelf: 'flex-start' }}>{`Closed at: ${dayjs(bill.closedAt)
          .format('HH:mm')
          .toString()}`}</Text>
      </Left>
      <Body>
        <Text>{`Total: ${formatNumber(summary.total, currency)}`}</Text>
        <Text>{`Change: ${formatNumber(summary.changeTotal, currency)}`}</Text>
        {hasDiscount && <Text>{`Discount: ${formatNumber(summary.discountTotal, currency)}`}</Text>}
      </Body>
      <Right>
        {summary.paymentBreakdown.map(type => {
          const paymentTypeName = keyedPaymentTypes[type.paymentTypeId].name;
          const key = `${bill.id}-${type.paymentTypeId}`;
          const amount = formatNumber(type.totalPayed, currency);
          return <Text key={key}>{`${capitalize(paymentTypeName)}: ${amount}`}</Text>;
        })}
        {/* <Text>{summary.paymentMethods.map(capitalize).join(', ')}</Text>
        <Text>{summary.paymentMethods.map(capitalize).join(', ')}</Text> */}
      </Right>
    </ListItem>
  );
};

const enhance = withObservables<TransactionListRowOuterProps, TransactionListRowInnerProps>(['bill'], ({ bill }) => ({
  chargableBillItems: bill.chargableBillItems,
  billDiscounts: bill.billDiscounts,
  billPayments: bill.billPayments,
}));

export const TransactionListRow = enhance(TransactionListRowInner);

const styles = StyleSheet.create({
  selected: { backgroundColor: '#cde1f9' },
});

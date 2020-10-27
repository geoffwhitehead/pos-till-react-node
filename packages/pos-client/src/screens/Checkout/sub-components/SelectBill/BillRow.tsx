import React, { useState, useEffect, useContext } from 'react';
import { ListItem, Left, Text, Body, Right, Icon } from '../../../../core';
import { formatNumber, _total, billSummary, BillSummary } from '../../../../utils';
import withObservables from '@nozbe/with-observables';
import { tableNames, Bill, Discount, BillItem, BillDiscount, BillPayment } from '../../../../models';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { Database } from '@nozbe/watermelondb';
import { OrganizationContext } from '../../../../contexts/OrganizationContext';

interface BillRowInnerProps {
  billPayments: BillPayment[];
  billDiscounts: BillDiscount[];
  billItems: BillItem[];
  billItemsIncPendingVoids: BillItem[];
  discounts: Discount[];
  billItemsVoidsStatusUnstoredCount: number;
  billItemsVoidsStatusErrorsCount: number;
  billItemsVoidsStatusPendingCount: number;
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
  billItemsIncPendingVoids,
  billItemsVoidsStatusUnstoredCount,
  billItemsVoidsStatusErrorsCount,
  billItemsVoidsStatusPendingCount,
  billPayments,
  billDiscounts,
  discounts,
}) => {
  const [summary, setSummary] = useState<BillSummary>();
  const {
    organization: { currency },
  } = useContext(OrganizationContext);

  useEffect(() => {
    const summary = async () => {
      const summary = await billSummary(billItems, billDiscounts, billPayments, discounts);
      setSummary(summary);
    };
    summary();
  }, [billItems]);

  const renderPrintErrors = () => {
    const hasUnstoredItems = !!billItemsVoidsStatusUnstoredCount;
    const hasPrintErrors = !!billItemsVoidsStatusErrorsCount;
    const hasPendingPrints = !!billItemsVoidsStatusPendingCount;

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
    if (hasPendingPrints) {
      return [
        <Icon active name="ios-print" style={{ marginLeft: 20, marginRight: 2, color: 'grey' }} />,
        <Text note>Printing</Text>,
      ];
    }
    return null;
  };
  return (
    <ListItem key={bill.id} onPress={() => onSelectBill(bill)}>
      <Left>
        <Text style={{ color: 'green' }}>{`${bill.reference}: Open`}</Text>
        {renderPrintErrors()}
      </Left>

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
      billItemsIncPendingVoids: bill.billItemsIncPendingVoids,
      billItemsVoidsStatusUnstoredCount: bill.billItemsVoidsStatusUnstored.observeCount(),
      billItemsVoidsStatusErrorsCount: bill.billItemsVoidsStatusErrors.observeCount(),
      billItemsVoidsStatusPendingCount: bill.billItemsVoidsStatusPending.observeCount(),
      discounts: database.collections.get<Discount>(tableNames.discounts).query(),
    }))(component),
  );

export const BillRow = enhance(WrappedBillRow);

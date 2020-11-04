import { groupBy } from 'lodash';
import { Separator, Text, ListItem, Left, Right } from '../../../../../core';
import React from 'react';
import { capitalize } from 'lodash';
import { ItemBreakdown } from './ItemBreakdown';
import { Bill, BillItem, BillItemPrintLog, Discount, tableNames } from '../../../../../models';
import withObservables from '@nozbe/with-observables';
import { WrappedBillRow } from '../../../../Bills/SelectBill/BillRow';
import { PrintStatus, PrintType } from '../../../../../models/BillItemPrintLog';

type ItemsBreakdownOuterProps = {
  bill: Bill;
  readonly: boolean;
  onSelect: (bI: BillItem) => void;
};

type ItemsBreakdownInnerProps = {
  billItems: BillItem[];
  billItemStatusLogs: BillItemPrintLog[];
};

export const ItemsBreakdownInner: React.FC<ItemsBreakdownOuterProps & ItemsBreakdownInnerProps> = ({
  billItems,
  readonly,
  onSelect,
  billItemStatusLogs,
}) => {
  if (!billItems) {
    return null;
  }

  const billItemGroups: Record<string, BillItem[]> = groupBy(billItems, item => item.priceGroupId);
  const keyedLogGroups: Record<string, BillItemPrintLog[]> = groupBy(billItemStatusLogs, log => log.billItemId);

  console.log('keyedLogGroups', keyedLogGroups);

  return (
    <>
      <Separator bordered key="ib_sep">
        <Text>Items</Text>
      </Separator>
      {Object.values(billItemGroups).map(billItemGroup => {
        return [
          <ListItem itemDivider first key={billItemGroup[0].priceGroupId}>
            <Left>
              <Text>{billItemGroup[0].priceGroupName}</Text>
            </Left>
            <Right>
              <Text>{`${billItemGroup.length} items`}</Text>
            </Right>
          </ListItem>,
          ...billItemGroup.map(billItem => {
            const logs = keyedLogGroups[billItem.id] || [];

            const hasSucceeded = logs.some(log => log.status === PrintStatus.pending);
            const hasErrored = logs.some(log => log.status === PrintStatus.errored);
            const isProcessing = logs.some(log => log.status === PrintStatus.processing);

            const isVoidComplete =
              billItem.isVoided &&
              logs.some(log => log.type === PrintType.void && log.status === PrintStatus.succeeded);

            const status = hasErrored
              ? PrintStatus.errored
              : isProcessing
              ? PrintStatus.processing
              : hasSucceeded
              ? PrintStatus.succeeded
              : null;

            if (isVoidComplete) {
              return null;
            }

            return (
              <ItemBreakdown
                key={billItem.id}
                billItem={billItem}
                readonly={readonly}
                onSelect={onSelect}
                status={status}
              />
            );
          }),
        ];
      })}
    </>
  );
};

const enhance = component =>
  withObservables<ItemsBreakdownOuterProps, ItemsBreakdownInnerProps>(['bill'], ({ bill }) => ({
    bill,
    billItemStatusLogs: bill.billItemStatusLogs.observeWithColumns(['status']),
    billItems: bill.billItems,
  }))(component);

export const ItemsBreakdown = enhance(ItemsBreakdownInner);

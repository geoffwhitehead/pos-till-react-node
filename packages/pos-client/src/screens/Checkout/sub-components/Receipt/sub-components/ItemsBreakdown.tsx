import withObservables from '@nozbe/with-observables';
import { groupBy } from 'lodash';
import React from 'react';
import { Left, ListItem, Right, Separator, Text, View } from '../../../../../core';
import { Bill, BillItem, BillItemPrintLog } from '../../../../../models';
import { PrintStatus, PrintType } from '../../../../../models/BillItemPrintLog';
import { ItemBreakdown } from './ItemBreakdown';

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
  ...props
}) => {
  if (!billItems) {
    return null;
  }

  const billItemGroups: Record<string, BillItem[]> = groupBy(billItems, item => item.priceGroupId);
  const keyedLogGroups: Record<string, BillItemPrintLog[]> = groupBy(billItemStatusLogs, log => log.billItemId);

  return (
    <View {...props}>
      <Separator bordered>
        <Text>Items</Text>
      </Separator>
      {Object.values(billItemGroups).map(billItemGroup => {
        return [
          <ListItem itemDivider first key={billItemGroup[0].priceGroupId}>
            <Left>
              <Text style={{ fontWeight: 'bold' }}>{billItemGroup[0].priceGroupName}</Text>
            </Left>
            <Right>
              <Text style={{ fontWeight: 'bold' }}>{`${billItemGroup.length} items`}</Text>
            </Right>
          </ListItem>,
          ...billItemGroup.map(billItem => {
            const logs = keyedLogGroups[billItem.id] || [];

            const hasSucceeded = logs.length > 0 && logs.every(log => log.status === PrintStatus.succeeded);
            const hasErrored = logs.some(log => log.status === PrintStatus.errored);
            const isProcessing = logs.some(log => log.status === PrintStatus.processing);
            const isPending = logs.some(log => log.status === PrintStatus.pending);

            console.log('logs', logs);
            const status = hasSucceeded
              ? PrintStatus.succeeded
              : hasErrored
              ? PrintStatus.errored
              : isProcessing
              ? PrintStatus.processing
              : isPending
              ? PrintStatus.pending
              : null;

            console.log('status', status);
            const isVoidComplete =
              billItem.isVoided &&
              logs.some(log => log.type === PrintType.void && log.status === PrintStatus.succeeded);

            if (isVoidComplete) {
              return null;
            }

            if (billItem.isVoided && (!status || status === PrintStatus.succeeded)) {
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
    </View>
  );
};

const enhance = component =>
  withObservables<ItemsBreakdownOuterProps, ItemsBreakdownInnerProps>(['bill'], ({ bill }) => ({
    bill,
    billItemStatusLogs: bill.billItemStatusLogs.observeWithColumns(['status']),
    billItems: bill.billItems,
  }))(component);

export const ItemsBreakdown = enhance(ItemsBreakdownInner);

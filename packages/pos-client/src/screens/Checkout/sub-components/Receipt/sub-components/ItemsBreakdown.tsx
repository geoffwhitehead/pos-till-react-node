import withObservables from '@nozbe/with-observables';
import { groupBy } from 'lodash';
import React from 'react';
import { Left, ListItem, Right, Separator, Text, View } from '../../../../../core';
import { Bill, BillItem, BillItemModifierItem, BillItemPrintLog } from '../../../../../models';
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
  billItemModifierItems: BillItemModifierItem[];
};

export const ItemsBreakdownInner: React.FC<ItemsBreakdownOuterProps & ItemsBreakdownInnerProps> = ({
  billItems,
  readonly,
  onSelect,
  billItemStatusLogs,
  billItemModifierItems,
  ...props
}) => {
  if (!billItems) {
    return null;
  }

  const billItemGroups = groupBy(billItems, item => item.priceGroupId);
  const keyedLogGroups = groupBy(billItemStatusLogs, log => log.billItemId);
  const groupedModifierItemsByItem = groupBy(billItemModifierItems, item => item.billItemId);

  return (
    <View {...props}>
      <Separator bordered>
        <Text>Items</Text>
      </Separator>
      {Object.values(billItemGroups).map(billItemGroup => {
        const filteredBillItems = billItemGroup
          .map(billItem => {
            const logs = keyedLogGroups[billItem.id] || [];

            const hasSucceeded = logs.length > 0 && logs.every(log => log.status === PrintStatus.succeeded);
            const hasErrored = logs.some(log => log.status === PrintStatus.errored);
            const isProcessing = logs.some(log => log.status === PrintStatus.processing);
            const isPending = logs.some(log => log.status === PrintStatus.pending);

            const status = hasSucceeded
              ? PrintStatus.succeeded
              : hasErrored
              ? PrintStatus.errored
              : isProcessing
              ? PrintStatus.processing
              : isPending
              ? PrintStatus.pending
              : null;

            const isVoidComplete =
              billItem.isVoided &&
              logs.some(log => log.type === PrintType.void && log.status === PrintStatus.succeeded);

            if (isVoidComplete) {
              return null;
            }

            if (billItem.isVoided && (!status || status === PrintStatus.succeeded)) {
              return null;
            }

            const modifierItems = groupedModifierItemsByItem[billItem.id] || [];

            return (
              <ItemBreakdown
                key={billItem.id}
                billItem={billItem}
                modifierItems={modifierItems}
                readonly={readonly}
                onSelect={onSelect}
                status={status}
              />
            );
          })
          .filter(billItem => billItem !== null);

        if (filteredBillItems.length === 0) {
          return null;
        }

        return [
          <ListItem itemDivider first key={billItemGroup[0].priceGroupId}>
            <Left>
              <Text style={{ fontWeight: 'bold' }}>{billItemGroup[0].priceGroupName}</Text>
            </Left>
            <Right>
              <Text style={{ fontWeight: 'bold' }}>{`${billItemGroup.length} items`}</Text>
            </Right>
          </ListItem>,
          ...filteredBillItems,
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
    billItemModifierItems: bill._billModifierItems,
  }))(component);

export const ItemsBreakdown = enhance(ItemsBreakdownInner);

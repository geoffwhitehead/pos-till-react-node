import withObservables from '@nozbe/with-observables';
import React, { useContext } from 'react';
import { OrganizationContext } from '../../../../../contexts/OrganizationContext';
import { ListItem, Text, View } from '../../../../../core';
import { Bill, BillItem, PriceGroup } from '../../../../../models';
import { ItemBreakdown } from './ItemBreakdown';

type ItemsBreakdownByPriceGroupOuterProps = {
  bill: Bill;
  readonly: boolean;
  onSelect: (bI: BillItem) => void;
  priceGroup: PriceGroup;
};

type ItemsBreakdownByPriceGroupInnerProps = {
  billItems: BillItem[];
  billItemsCount: number;
};

export const ItemsBreakdownByPriceGroupInner: React.FC<ItemsBreakdownByPriceGroupOuterProps &
  ItemsBreakdownByPriceGroupInnerProps> = ({ billItems, onSelect, priceGroup, readonly, billItemsCount, ...props }) => {
  const {
    organization: { currency },
  } = useContext(OrganizationContext);

  return (
    <View {...props}>
      <ListItem itemDivider first>
        <Text style={{ fontWeight: 'bold' }}>{priceGroup.name}</Text>
        <Text>{` (${billItemsCount} items) `}</Text>
      </ListItem>
      {billItems.map(billItem => (
        <ItemBreakdown
          key={billItem.id}
          billItem={billItem}
          readonly={readonly}
          onSelect={onSelect}
          currency={currency}
        />
      ))}
    </View>
  );
};

const enhance = component =>
  withObservables<ItemsBreakdownByPriceGroupOuterProps, ItemsBreakdownByPriceGroupInnerProps>(
    ['bill', 'priceGroup'],
    ({ bill, priceGroup }) => ({
      bill,
      priceGroup,
      billItems: priceGroup.billItems,
      billItemsCount: priceGroup.billItemsExclVoids.observeCount(),
      // billItemPrintLogs: bill.billItemStatusLogs.observeWithColumns(['status']),
      // billItems: bill.billItems,
      // priceGroupToDisplay: bill.priceGroupsToDisplay
      // billItemModifierItems: bill._billModifierItems,
    }),
  )(component);

export const ItemsBreakdownByPriceGroup = enhance(ItemsBreakdownByPriceGroupInner);
//   const filteredBillItems = billItemGroup
//   .map(billItem => {
//     const logs = groupedLogGroups[billItem.id] || [];

//     const hasSucceeded = logs.length > 0 && logs.every(log => log.status === PrintStatus.succeeded);
//     const hasErrored = logs.some(log => log.status === PrintStatus.errored);
//     const isProcessing = logs.some(log => log.status === PrintStatus.processing);
//     const isPending = logs.some(log => log.status === PrintStatus.pending);

//     const status = hasSucceeded
//       ? PrintStatus.succeeded
//       : hasErrored
//       ? PrintStatus.errored
//       : isProcessing
//       ? PrintStatus.processing
//       : isPending
//       ? PrintStatus.pending
//       : null;

//     const isVoidComplete =
//       billItem.isVoided && logs.some(log => log.type === PrintType.void && log.status === PrintStatus.succeeded);

//     if (isVoidComplete) {
//       return null;
//     }

//     if (billItem.isVoided && (!status || status === PrintStatus.succeeded)) {
//       return null;
//     }

//     const modifierItems = groupedModifierItemsByItem[billItem.id] || [];

//     return (
//       <ItemBreakdown
//         key={billItem.id}
//         billItem={billItem}
//         modifierItems={modifierItems}
//         readonly={readonly}
//         onSelect={onSelect}
//         status={status}
//       />
//     );
//   })
//   .filter(billItem => billItem !== null);

// if (filteredBillItems.length === 0) {
//   return null;
// }

// return [
//   <ListItem itemDivider first key={billItemGroup[0].priceGroupId}>
//     <Text style={{ fontWeight: 'bold' }}>{billItemGroup[0].priceGroupName}</Text>
//     <Text>{` (${billItemGroup.length} items) `}</Text>
//   </ListItem>,
//   ...filteredBillItems,
// ];

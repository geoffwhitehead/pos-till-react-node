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
      billItems: bill.billItemsByPriceGroup(priceGroup.id),
      billItemsCount: bill.billItemsByPriceGroupNoVoids(priceGroup.id).observeCount(),
    }),
  )(component);

export const ItemsBreakdownByPriceGroup = enhance(ItemsBreakdownByPriceGroupInner);

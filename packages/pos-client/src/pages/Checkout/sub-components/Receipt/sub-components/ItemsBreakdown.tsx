import { groupBy } from 'lodash';
import { Separator, Text, ListItem } from '../../../../../core';
import React from 'react';
import { capitalize } from 'lodash';
import { ItemBreakdown } from './ItemBreakdown';

export const ItemsBreakdown: React.FC<{
  items: any;
  readonly: boolean;
  selected: boolean;
  onSelect: (item) => void;
}> = ({ items, readonly, selected, onSelect }) => {
  if (!items) {
    return null;
  }

  const billItemGroups = groupBy(items, item => item.priceGroupId);

  console.log('billItemGroups', billItemGroups);
  return (
    <>
      <Separator bordered>
        <Text>Items</Text>
      </Separator>
      {Object.values(billItemGroups).map(itemGroup => {
        return [
          <ListItem itemHeader first>
            <Text>{capitalize(itemGroup[0].priceGroupName)}</Text>
          </ListItem>,
          ...itemGroup.map(item => (
            <ItemBreakdown item={item} readonly={readonly} selected={selected} onSelect={onSelect} />
          )),
        ];
      })}
    </>
  );
};

import { Database, Q } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { keyBy } from 'lodash';
import React from 'react';
import { ListItem, Text } from '../../../../../../core';
import { Modifier, ModifierItem, ModifierItemPrice, PriceGroup, tableNames } from '../../../../../../models';
import { ModifierItemRow } from './ModifierItemRow';

interface ModifierGroupOuterProps {
  modifier: Modifier;
  priceGroup: PriceGroup;
  onPressModifierItem: (m: Modifier, mI: ModifierItem) => void;
  selectedModifierItems: ModifierItem[];
  database: Database;
}

interface ModifierGroupInnerProps {
  modifierItems: ModifierItem[];
  modifierItemPrices: ModifierItemPrice[];
}

const WrappedModifierGroup: React.FC<ModifierGroupInnerProps & ModifierGroupOuterProps> = ({
  modifier,
  modifierItems,
  onPressModifierItem,
  selectedModifierItems,
  modifierItemPrices,
}) => {
  const _onPressModifierItem = modifierItem => {
    onPressModifierItem(modifier, modifierItem);
  };

  const keyedModifierPricesByModifierItem = keyBy(
    modifierItemPrices,
    modifierItemPrice => modifierItemPrice.modifierItemId,
  );
  const { minItems, maxItems, name } = modifier;

  const single = minItems === maxItems;
  const range = minItems < maxItems;

  const plural = maxItems === 1 ? 'modifier' : 'modifiers';
  const singleMessage = `Choose ${minItems} ${plural}`;
  const rangeSelection = `Choose between ${minItems} and ${maxItems} ${plural}`;

  const message = single ? singleMessage : range ? rangeSelection : '';

  console.log('modifierItems', modifierItems);
  const hasNoPricesSet = modifierItems.length === 0;

  return (
    <>
      <ListItem itemHeader>
        <Text>{name}</Text>
      </ListItem>
      {hasNoPricesSet && (
        <Text style={{ paddingTop: 15, paddingBottom: 15 }} note>
          No prices have been set for this modifier in this price group. You can set modifier item prices by navigating
          to the items sidebar menu - modifiers tab.
        </Text>
      )}
      {modifierItems.map(modifierItem => {
        const modifierItemPrice = keyedModifierPricesByModifierItem[modifierItem.id];
        const isSelected = selectedModifierItems.includes(modifierItem);
        console.log('modifierItemPrice', modifierItemPrice);
        const isDisabled = modifierItemPrice.price === null;

        return (
          <ModifierItemRow
            key={modifierItem.id}
            selected={isSelected}
            modifierItem={modifierItem}
            modifierItemPrice={modifierItemPrice}
            onPress={_onPressModifierItem}
            isDisabled={isDisabled}
          />
        );
      })}
      <Text style={{ padding: 15 }} note>
        {message}
      </Text>
    </>
  );
};

export const ModifierGroup = withDatabase(
  withObservables<ModifierGroupOuterProps, ModifierGroupInnerProps>(
    ['modifier', 'priceGroup'],
    ({ modifier, priceGroup, database }) => ({
      priceGroup,
      modifier,
      // modifierItems: modifier.modifierItems,
      modifierItemPrices: database.collections
        .get<ModifierItemPrice>(tableNames.modifierItemPrices)
        .query(Q.where('price_group_id', priceGroup.id), Q.on(tableNames.modifierItems, 'modifier_id', modifier.id)),
      modifierItems: modifier.modifierItems.extend(
        Q.on(tableNames.modifierItemPrices, [
          Q.where('price_group_id', priceGroup.id),
          Q.where('price', Q.notEq(null)),
        ]),
      ),
    }),
  )(WrappedModifierGroup),
);

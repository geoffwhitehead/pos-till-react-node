import withObservables from '@nozbe/with-observables';
import { View } from 'native-base';
import React from 'react';
import { Header, Text } from '../../../../../../core';
import { Modifier, ModifierItem, PriceGroup } from '../../../../../../models';
import { ModifierItemRow } from './ModifierItemRow';

interface ModifierGroupOuterProps {
  modifier: Modifier;
  priceGroup: PriceGroup;
  onPressModifierItem: (m: Modifier, mI: ModifierItem) => void;
  selectedModifierItems: ModifierItem[];
}

interface ModifierGroupInnerProps {
  modifierItems: ModifierItem[];
}

const WrappedModifierGroup: React.FC<ModifierGroupInnerProps & ModifierGroupOuterProps> = ({
  modifier,
  priceGroup,
  modifierItems,
  onPressModifierItem,
  selectedModifierItems,
}) => {
  const _onPressModifierItem = modifierItem => {
    onPressModifierItem(modifier, modifierItem);
  };

  const { minItems, maxItems, name } = modifier;

  const single = minItems === maxItems;
  const range = minItems === 0 && maxItems > 0;

  const plural = maxItems === 1 ? 'modifier' : 'modifiers';
  const singleMessage = `Choose ${minItems} ${plural}`;
  const rangeSelection = `Choose between ${minItems} and ${maxItems} ${plural}`;

  const message = single ? singleMessage : range ? rangeSelection : '';

  return (
    <View>
      <Header>
        <Text style={{ fontSize: 22 }}>{name}</Text>
      </Header>
      {modifierItems.map(item => (
        <ModifierItemRow
          key={item.id}
          selected={selectedModifierItems.includes(item)}
          modifierItem={item}
          priceGroup={priceGroup}
          onPress={_onPressModifierItem}
        />
      ))}
      <Text style={{ padding: 15 }} note>
        {message}
      </Text>
    </View>
  );
};

export const ModifierGroup = withObservables<ModifierGroupOuterProps, ModifierGroupInnerProps>(
  ['modifier'],
  ({ modifier }) => ({
    modifierItems: modifier.modifierItems,
  }),
)(WrappedModifierGroup);

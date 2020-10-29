import React from 'react';
import withObservables from '@nozbe/with-observables';
import { Text } from '../../../../../../core';
import { View } from 'native-base';
import { ModifierItemRow } from './ModifierItemRow';
import { ModifierItem, Modifier, PriceGroup } from '../../../../../../models';

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

  return (
    <View>
      <Text>{modifier.name}</Text>
      {modifierItems.map(item => (
        <ModifierItemRow
          key={item.id}
          selected={selectedModifierItems.includes(item)}
          modifierItem={item}
          priceGroup={priceGroup}
          onPress={_onPressModifierItem}
        />
      ))}
    </View>
  );
};

export const ModifierGroup = withObservables<ModifierGroupOuterProps, ModifierGroupInnerProps>(
  ['modifier'],
  ({ modifier }) => ({
    modifierItems: modifier.modifierItems,
  }),
)(WrappedModifierGroup);

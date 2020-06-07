import React from 'react';
import withObservables from '@nozbe/with-observables';
import { Text } from '../../../../../../core';
import { View } from 'native-base';
import { ModifierItem } from './ModifierItem';

interface ModifierGroupProps {
  modifierItems: any;
  modifier: any;
  priceGroup: any;
  onPressModifierItem: any;
  selectedModifierItems: any[];
}

const WrappedModifierGroup: React.FC<ModifierGroupProps> = ({
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
        <ModifierItem
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

export const ModifierGroup = withObservables<any, any>(['modifier'], ({ modifier }) => ({
  modifierItems: modifier.modifierItems,
}))(WrappedModifierGroup);

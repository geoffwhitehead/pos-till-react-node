import React from 'react';
import withObservables from '@nozbe/with-observables';
import { ListItem, Text } from '../../../../../../core';
import { TextInput } from 'react-native-gesture-handler';
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
  console.log('modifierItems', modifierItems);

  const _onPressModifierItem = modifierItem => {
    console.log('modifierItem', modifierItem);
    onPressModifierItem(modifier, modifierItem);
  };

  console.log('selectedModifierItems', selectedModifierItems);
  return (
    <View>
      <Text>{modifier.name}</Text>
      {modifierItems.map(item => (
        <ModifierItem
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

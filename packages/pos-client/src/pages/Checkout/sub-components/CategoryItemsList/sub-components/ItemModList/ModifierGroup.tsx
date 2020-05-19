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
}

const WrappedModifierGroup: React.FC<ModifierGroupProps> = ({ modifier, priceGroup, modifierItems }) => {
  console.log('modifierItems', modifierItems);
  return (
    <View>
      <Text>{modifier.name}</Text>
      {modifierItems.map(item => (
        <ModifierItem modifierItem={item} priceGroup={priceGroup} />
      ))}
    </View>
  );
};

export const ModifierGroup = withObservables<any, any>(['modifier'], ({ modifier }) => ({
  modifierItems: modifier.modifierItems,
}))(WrappedModifierGroup);

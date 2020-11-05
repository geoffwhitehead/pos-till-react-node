import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Content, Text, List, ListItem, Left, Icon, Body, Right, Button } from '../../../../../../core';
import withObservables from '@nozbe/with-observables';
import { ModifierGroup } from './ModifierGroup';
import { keyBy } from 'lodash';
import { View } from 'native-base';
import { NumberPicker } from '../../../../../../components/NumberPicker/NumberPicker';
import { Item, Bill, PriceGroup, Modifier, ModifierItem } from '../../../../../../models';
import { useDatabase } from '@nozbe/watermelondb/hooks';

interface ModifierListOuterProps {
  item: Item;
  currentBill: Bill;
  priceGroup: PriceGroup;
  onClose: () => void;
}

interface ModifierListInnerProps {
  modifiers: Modifier[];
}

type KeyedModifierSelections = Record<string, { modifier: Modifier; items: ModifierItem[] }>;

export const ModifierListInner: React.FC<ModifierListOuterProps & ModifierListInnerProps> = ({
  item,
  currentBill,
  priceGroup,
  onClose,
  modifiers,
}) => {
  const database = useDatabase();
  const [quantity, setQuantity] = useState(1);
  const keyedEmptyModifierSelections = keyBy(
    modifiers.map(modifier => ({ modifier, items: [] })),
    'modifier.id',
  );
  const [selectedModifiers, setSelectedModifiers] = useState<KeyedModifierSelections>(keyedEmptyModifierSelections);

  const isSelectionValid = Object.keys(selectedModifiers).some(key => {
    const { modifier, items } = selectedModifiers[key];
    return !(items.length < modifier.minItems || items.length > modifier.maxItems);
  });

  const createItemWithModifiers = async () => {
    await database.action(() =>
      currentBill.addItems({ item, priceGroup, quantity, selectedModifiers: Object.values(selectedModifiers) }),
    );
    onClose();
  };

  const onPressModifierItem = (modifier: Modifier, modifierItem: ModifierItem) => {
    const m = selectedModifiers[modifier.id];
    const containsModifier = m.items.includes(modifierItem);
    if (containsModifier) {
      setSelectedModifiers({
        ...selectedModifiers,
        [modifier.id]: { modifier, items: [...m.items.filter(mI => mI !== modifierItem)] },
      });
    } else if (m.modifier.maxItems > m.items.length) {
      setSelectedModifiers({ ...selectedModifiers, [modifier.id]: { modifier, items: [...m.items, modifierItem] } });
    }
  };

  return (
    <Content style={styles.modal}>
      <View style={styles.headerButtons}>
        <Button light onPress={onClose}>
          <Text>Cancel</Text>
        </Button>
        <Button disabled={!isSelectionValid} onPress={createItemWithModifiers}>
          <Text>Save</Text>
        </Button>
      </View>
      {item && (
        <List>
          <ListItem itemHeader first>
            <Left>
              <Icon onPress={onClose} name="ios-arrow-back" />
              <Text style={{ fontWeight: 'bold' }}>{`${item.name} / Modifiers`}</Text>
            </Left>
            <Body></Body>
            <Right />
          </ListItem>
          {modifiers.map(modifier => {
            const selectedItems = selectedModifiers[modifier.id].items;
            return (
              <ModifierGroup
                key={modifier.id}
                selectedModifierItems={selectedItems}
                onPressModifierItem={onPressModifierItem}
                modifier={modifier}
                priceGroup={priceGroup}
              />
            );
          })}
        </List>
      )}
      <NumberPicker onPress={v => setQuantity(v)} />
    </Content>
  );
};

export const ModifierList = withObservables<ModifierListOuterProps, ModifierListInnerProps>(['item'], ({ item }) => ({
  modifiers: item.modifiers,
}))(ModifierListInner);

const styles = StyleSheet.create({
  modal: {
    borderRadius: 5,
    backgroundColor: 'white',
    width: 400,
    padding: 10,
  },
  headerButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});

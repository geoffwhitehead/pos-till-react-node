import React, { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ItemProps, ModifierItemProps } from '../../../../../../services/schemas';
import { Content, Text, List, ListItem, Left, Icon, Body, Right, Button } from '../../../../../../core';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { tNames } from '../../../../../../models';
import { PriceGroupContext } from '../../../../../../contexts/PriceGroupContext';
import { CurrentBillContext } from '../../../../../../contexts/CurrentBillContext';
import { ModifierGroup } from './ModifierGroup';
import { Formik } from 'formik';
import { keyBy, times } from 'lodash';
import { View, Input } from 'native-base';
import { NumberPicker } from '../../../../../../components/NumberPicker/NumberPicker';

interface ModifierListProps {
  item?: ItemProps;
  currentBill: any;
  priceGroup: any;
  onClose: () => void;
  modifiers: any;
}

export const WrappedModifierList: React.FC<ModifierListProps> = ({
  item,
  currentBill,
  priceGroup,
  onClose,
  modifiers,
}) => {
  const [quantity, setQuantity] = useState(1);

  const [selectedModifiers, setSelectedModifiers] = useState(
    keyBy(
      modifiers.map(modifier => ({ modifier, items: [] })),
      'modifier.id',
    ),
  );

  const isSelectionValid = Object.keys(selectedModifiers).some(key => {
    const { modifier, items } = selectedModifiers[key];
    return !(items.length < modifier.minItems || items.length > modifier.maxItems);
  });

  const createItemWithModifiers = async () => {
    const create = async () => {
      const billItem = await currentBill.addItem({ item, priceGroup });

      await Promise.all(
        Object.values(selectedModifiers).map(({ modifier, items }) =>
          billItem.addModifierChoices(modifier, items, priceGroup),
        ),
      );
    };

    await times(quantity, create);

    onClose();
  };

  const onPressModifierItem = (modifier, modifierItem) => {
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

export const ModifierList = withObservables(['item'], ({ item }) => ({
  modifiers: item.modifiers,
}))(WrappedModifierList);

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
import { useDatabase } from '@nozbe/watermelondb/hooks';
import withObservables from '@nozbe/with-observables';
import { keyBy } from 'lodash';
import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { ModalContentButton } from '../../../../../../components/Modal/ModalContentButton';
import { NumberPicker } from '../../../../../../components/NumberPicker/NumberPicker';
import { Container, List } from '../../../../../../core';
import { Bill, Item, Modifier, ModifierItem, PriceGroup } from '../../../../../../models';
import { ModifierGroup } from './ModifierGroup';

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
    const hasTooFewSelectedItems = items.length < modifier.minItems;
    const hasTooManySelectedItems = items.length > modifier.maxItems;

    const isValid = !hasTooFewSelectedItems && !hasTooManySelectedItems;
    return isValid;
  });

  const createItemWithModifiers = async () => {
    await database.action(() =>
      currentBill.addItems({ item, priceGroup, quantity, selectedModifiers: Object.values(selectedModifiers) }),
    );
    onClose();
  };

  const onPressModifierItem = (modifier: Modifier, modifierItem: ModifierItem) => {
    console.log('---------');
    console.log('modifierItem', modifierItem);

    console.log('selectedModfiiers', selectedModifiers['6d69cbb9-39a0-4330-bc12-bf5403d2017f'].items);
    const m = selectedModifiers[modifier.id];
    const containsModifier = m.items.includes(modifierItem);
    console.log('containsModifier', containsModifier);
    if (containsModifier) {
      setSelectedModifiers({
        ...selectedModifiers,
        [modifier.id]: { modifier, items: [...m.items.filter(mI => mI !== modifierItem)] },
      });
    } else {
      setSelectedModifiers({ ...selectedModifiers, [modifier.id]: { modifier, items: [...m.items, modifierItem] } });
    }
  };

  return (
    <ModalContentButton
      onPressPrimaryButton={createItemWithModifiers}
      isPrimaryDisabled={!isSelectionValid}
      onPressSecondaryButton={onClose}
      secondaryButtonText="Cancel"
      primaryButtonText="Save"
      title={`${item.name}: Modifiers`}
      size="small"
    >
      <Container>
        <ScrollView>
          <List>
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
        </ScrollView>
        <NumberPicker onPress={v => setQuantity(v)} />
      </Container>
    </ModalContentButton>
  );
};

const styles = {
  content: {
    textAlign: 'center',
    display: 'flex',
  } as const,
};

export const ModifierList = withObservables<ModifierListOuterProps, ModifierListInnerProps>(['item'], ({ item }) => ({
  modifiers: item.modifiers.observeWithColumns(['minItems', 'maxItems']),
}))(ModifierListInner);

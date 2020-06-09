import React, { useState, useContext } from 'react';
import { Text, Content, List, ListItem, Left, Icon, Body, Right } from '../../../../core';
import { SearchHeader } from '../../../../components/SearchHeader/SearchHeader';
import Modal from 'react-native-modal';
import { ModifierList } from './sub-components/ModifierList/ModifierList';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { PriceGroupContext } from '../../../../contexts/PriceGroupContext';
import { CurrentBillContext } from '../../../../contexts/CurrentBillContext';
import { CategoryItemRow } from './sub-components/CategoryItemRow';
import { Category, Item, Modifier } from '../../../../models';
import { StackNavigationProp } from '@react-navigation/stack';
import { CheckoutItemStackParamList } from '../../../../navigators/CheckoutItemNavigator';
import { RouteProp } from '@react-navigation/native';
import { Database } from '@nozbe/watermelondb';

interface CategoryItemsListOuterProps {
  database?: Database;
  category?: Category;
  modifiers: Modifier[];
  route: RouteProp<CheckoutItemStackParamList, 'CategoryItemsList'>;
  navigation: StackNavigationProp<CheckoutItemStackParamList, 'CategoryItemsList'>; // TODO: type this
}

interface CategoryItemsListInnerProps {
  items: any; // TODO: type
}

const CategoryItemsInner: React.FC<CategoryItemsListOuterProps & CategoryItemsListInnerProps> = ({
  category,
  items,
  navigation,
}) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item>();
  const { priceGroup } = useContext(PriceGroupContext);
  const { currentBill } = useContext(CurrentBillContext);

  const goBack = () => navigation.goBack();

  const searchFilter = (item: Item, searchValue: string) => item.name.toLowerCase().includes(searchValue.toLowerCase());

  const onSearchHandler = (value: string) => setSearchValue(value);
  const onCancelHandler = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const onSelectItem = async (item: Item, modifierCount: number) => {
    if (modifierCount > 0) {
      setSelectedItem(item);
      setModalOpen(true);
    } else {
      await currentBill.addItem({ item, priceGroup });
    }
  };
  return (
    <Content>
      <SearchHeader onChangeText={onSearchHandler} value={searchValue} />
      <Modal
        propagateSwipe
        isVisible={modalOpen}
        onBackButtonPress={onCancelHandler}
        onBackdropPress={onCancelHandler}
        animationInTiming={50}
        animationOutTiming={50}
        hideModalContentWhileAnimating={true}
        backdropTransitionInTiming={50}
        backdropTransitionOutTiming={50}
      >
        {modalOpen && (
          <ModifierList
            priceGroup={priceGroup}
            currentBill={currentBill}
            onClose={onCancelHandler}
            item={selectedItem}
          />
        )}
      </Modal>

      <List>
        <ListItem itemHeader first>
          <Left>
            <Icon onPress={goBack} name="ios-arrow-back" />
            <Text style={{ fontWeight: 'bold' }}>{`${category ? category.name : 'All'} / Items`}</Text>
          </Left>
          <Body></Body>
          <Right />
        </ListItem>
        {items
          .filter(item => searchFilter(item, searchValue))
          .map(item => {
            return (
              <CategoryItemRow
                key={item.id}
                item={item}
                priceGroup={priceGroup}
                isActive={selectedItem === item}
                onPressItem={onSelectItem}
              />
            );
          })}
      </List>
    </Content>
  );
};

export const CategoryItems = withObservables<CategoryItemsListOuterProps, CategoryItemsListInnerProps>(
  ['route'],
  ({ route }) => {
    const { category } = route.params;
    return {
      category,
      items: category.items,
    };
  },
)(CategoryItemsInner);

export const AllItems = withDatabase<any>( // TODO: type
  withObservables<CategoryItemsListOuterProps, CategoryItemsListInnerProps>([], ({ database }) => ({
    items: database.collections.get<Item>('items').query(),
  }))(CategoryItemsInner),
);

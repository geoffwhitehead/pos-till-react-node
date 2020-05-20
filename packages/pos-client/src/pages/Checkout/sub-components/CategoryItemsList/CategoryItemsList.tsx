import React, { useState, useContext } from 'react';
import { Text, Content, List, ListItem, Left, Icon, Body, Right } from '../../../../core';
import { SearchHeader } from '../../../../components/SearchHeader/SearchHeader';
import { CategoryProps, ItemProps, ModifierProps, BillProps, ModifierItemProps } from '../../../../services/schemas';
import Modal from 'react-native-modal';
import { ModifierList } from './sub-components/ModifierList/ModifierList';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { PriceGroupContext } from '../../../../contexts/PriceGroupContext';
import { CurrentBillContext } from '../../../../contexts/CurrentBillContext';
import { CategoryItem } from './sub-components/CategoryItem';

interface CategoryItemsListProps {
  category: CategoryProps;
  items: ItemProps[];
  modifiers: ModifierProps[];
  // createBillItem: (bill: BillProps) => void;
  route: any;
  navigation: any; // TODO: type this
}

const WrappedCategoryItems: React.FC<CategoryItemsListProps> = ({
  category,
  items,
  // createBillItem,
  // route,
  navigation,
}) => {
  // const { category, items, createBillItem } = route.params;

  const [searchValue, setSearchValue] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ItemProps>();
  const { priceGroup } = useContext(PriceGroupContext);
  const { currentBill } = useContext(CurrentBillContext);

  const goBack = () => navigation.goBack();

  const searchFilter = (item: ItemProps, searchValue: string) =>
    item.name.toLowerCase().includes(searchValue.toLowerCase());

  const onSearchHandler = (value: string) => setSearchValue(value);
  const onCancelHandler = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const onSelectItem = async (item, modifierCount) => {
    if (modifierCount > 0) {
      setSelectedItem(item);
      setModalOpen(true);
    } else {
      const newItem = await currentBill.addItem({ item, priceGroup });
      console.log('newItem', newItem);
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
            onPressItem={onSelectItem}
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
          .map(item => (
            <CategoryItem
              item={item}
              priceGroup={priceGroup}
              isActive={selectedItem === item}
              onPressItem={onSelectItem}
            />
          ))}
      </List>
    </Content>
  );
};

export const CategoryItems = withObservables(['route'], ({ route }) => {
  console.log('route', route);

  const { category } = route.params;
  console.log('*** category', category);
  return {
    category: category.observe(),
    items: category.items.observe(),
  };
})(WrappedCategoryItems);

export const AllItems = withDatabase(
  withObservables([], ({ database }) => ({
    items: database.collections
      .get('items')
      .query()
      .observe(),
  }))(WrappedCategoryItems),
);

// // export const withUnWrappedRouteParams = (WrappedComponent) => {

// }

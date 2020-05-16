import React, { useState } from 'react';
import { Text, Content, List, ListItem, Left, Icon, Body, Right } from '../../../../core';
import { SearchHeader } from '../../../../components/SearchHeader/SearchHeader';
import { CategoryProps, ItemProps, ModifierProps, BillProps, ModifierItemProps } from '../../../../services/schemas';
import { routes } from '../../../../navigators/CheckoutItemNavigator';
import { StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { ItemModifierList } from './sub-components/ItemModList/ItemModList';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';

interface CategoryItemsListProps {
  category: CategoryProps;
  items: ItemProps[];
  modifiers: ModifierProps[];
  createBillItem: (bill: BillProps) => void;
  route: any;
  navigation: any; // TODO: type this
}

const WrappedCategoryItems: React.FC<CategoryItemsListProps> = ({
  category,
  items,
  createBillItem,
  route,
  navigation,
}) => {
  // const { category, items, createBillItem } = route.params;

  const [searchValue, setSearchValue] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ItemProps>();

  const goBack = () => navigation.goBack();

  const onPressItemFactory: (item: ItemProps) => () => void = item => () => {
    if (item.modifierId) {
      // const modifier = modifiers.filtered(`_id = "${item.modifierId._id}"`)[0];
      // navigation.navigate(routes.itemModifierList, {
      //   item,
      //   modifier,
      //   createBillItem,
      // });
      setSelectedItem(item);
      setModalOpen(true);
    } else {
      createBillItem(item);
    }
  };

  const createItemWithModifiers = (mods: ModifierItemProps[]) => {
    setModalOpen(false);
    createBillItem(selectedItem, mods);
  };

  const searchFilter = (item: ItemProps, searchValue: string) =>
    item.name.toLowerCase().includes(searchValue.toLowerCase());

  const onSearchHandler = (value: string) => setSearchValue(value);
  const onCancelHandler = () => {
    setModalOpen(false);
    setSelectedItem(null);
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
          <ItemModifierList createBillItem={createItemWithModifiers} onCancel={onCancelHandler} item={selectedItem} />
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
            const isActive = selectedItem && item._id === selectedItem._id;
            const containsMods = item.modifierId;
            return (
              <ListItem style={isActive && styles.activeRow} icon key={item._id} onPress={onPressItemFactory(item)}>
                <Left>
                  <Text>{item.name}</Text>
                </Left>
                <Body>{containsMods ? <Icon name="ios-arrow-forward" /> : null}</Body>
              </ListItem>
            );
          })}
      </List>
    </Content>
  );
};

const styles = StyleSheet.create({
  activeRow: {
    backgroundColor: '#cde1f9',
  },
});

export const CategoryItems = withObservables<
  { category: any }, // TODO: fix types
  { category: any; items: any }
>(['route'], ({ route }) => {
  console.log('route', route);

  const { category } = route.params;
  console.log('*** category', category);
  return {
    category: category.observe(),
    items: category.items.observe(),
  };
})(WrappedCategoryItems);

// // export const withUnWrappedRouteParams = (WrappedComponent) => {

// }

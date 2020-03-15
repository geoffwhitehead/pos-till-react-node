import React, { useState } from 'react';
import { Text, Content, List, ListItem, Left, Icon, Body, Right } from '../../../../core';
import { SearchHeader } from '../../../../components/SearchHeader/SearchHeader';
import { CategoryProps, ItemProps, ModifierProps, BillProps, ModifierItemProps } from '../../../../services/schemas';
import { routes } from '../../../../navigators/CheckoutItemNavigator';
import { StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { ItemModifierList } from './sub-components/ItemModList/ItemModList';

interface CategoryItemsListProps {
  category: CategoryProps;
  items: ItemProps[];
  modifiers: ModifierProps[];
  createBillItem: (bill: BillProps) => void;
}

const CategoryItemsListInner: React.FC<CategoryItemsListProps> = ({ route, navigation }) => {
  const { category, items, modifiers, createBillItem } = route.params;
  const [searchValue, setSearchValue] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ItemProps>();

  const goBack = () => navigation.goBack();

  type OnPressItemFactory = (item: ItemProps) => () => void;
  const onPressItemFactory: OnPressItemFactory = item => () => {
    console.log('item', item);
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

export const CategoryItemsList = React.memo(CategoryItemsListInner);

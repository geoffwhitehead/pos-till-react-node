import React, { useState } from 'react';
import { Text, Content, List, ListItem, Left, Icon, Body, Right } from '../../../../core';
import { SearchHeader } from '../../../../components/SearchHeader/SearchHeader';
import { useRealmQuery } from 'react-use-realm';
import { CategoryProps, ItemProps, ModifierProps, BillProps } from '../../../../services/schemas';
import { routes } from '../../../../navigators/CheckoutItemNavigator';

interface CategoryItemsListProps {
  category: CategoryProps;
  items: ItemProps[];
  modifiers: ModifierProps[];
  createBillItem: (bill: BillProps) => void;
}

export const CategoryItemsList: React.FC<CategoryItemsListProps> = ({ route, navigation }) => {
  const { category, items, modifiers, createBillItem } = route.params;
  const [searchValue, setSearchValue] = useState<string>('');

  const goBack = () => navigation.goBack();

  const onPressItemFactory = item => () => {
    console.log('item', item);
    if (item.modifierId) {
      const modifier = modifiers.filtered(`_id = "${item.modifierId._id}"`)[0];
      console.log('modifier', modifier);
      navigation.navigate(routes.itemModifierList, {
        item,
        modifier,
        createBillItem,
      });
    } else {
      createBillItem(item);
    }
  };

  const searchFilter = (item: ItemProps, searchValue: string) =>
    item.name.toLowerCase().includes(searchValue.toLowerCase());

  const onSearchHandler = (value: string) => setSearchValue(value);

  return (
    <Content>
      <SearchHeader onChangeText={onSearchHandler} value={searchValue} />

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
            const containsMods = item.modifierId;
            return (
              <ListItem icon key={item._id} onPress={onPressItemFactory(item)}>
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

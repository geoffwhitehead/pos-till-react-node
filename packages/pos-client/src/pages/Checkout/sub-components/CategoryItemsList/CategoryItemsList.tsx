import React from 'react';
import { Text, Content, List, ListItem, Left, Icon, Body, Right } from '../../../../core';
import { SearchHeader } from '../../../../components/SearchHeader/SearchHeader';
import { useRealmQuery } from 'react-use-realm';
import { ItemSchema, CategoryProps, ItemProps, ModifierProps, BillProps } from '../../../../services/schemas';
import { routes } from '../../../../navigators/CheckoutItemNavigator';

interface CategoryItemsListProps {
  category: CategoryProps;
  items: ItemProps[];
  modifiers: ModifierProps[];
  createBillItem: (bill: BillProps) => void;
}

export const CategoryItemsList: React.FC<CategoryItemsListProps> = ({ route, navigation }) => {
  const { category, items, modifiers, createBillItem } = route.params;

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
      // create a new bill item
      createBillItem(item);
    }
  };

  return (
    <Content>
      <SearchHeader />
      <List>
        <ListItem itemHeader first>
          <Left>
            <Icon onPress={goBack} name="ios-arrow-back" />
            <Text style={{ fontWeight: 'bold' }}>{`${category.name} / Items`}</Text>
          </Left>
          <Body></Body>
          <Right />
        </ListItem>
        {items.map(item => {
          const containsMods = item.modifierId;
          return (
            <ListItem icon key={item._id} onPress={onPressItemFactory(item)}>
              <Left>{containsMods ? <Icon name="ios-arrow-forward" /> : null}</Left>
              <Body>
                <Text>{item.name}</Text>
              </Body>
            </ListItem>
          );
        })}
      </List>
    </Content>
  );
};

import React, { useState, useContext, useCallback } from 'react';
import { Text, Content, List, ListItem, Left, ActionSheet, Icon, Body, Right, Button } from '../../../../core';
import { SearchHeader } from '../../../../components/SearchHeader/SearchHeader';
import { useRealmQuery } from 'react-use-realm';
import {
  CategorySchema,
  ItemSchema,
  ModifierSchema,
  BillItemSchema,
  BillItemModifierSchema,
  CategoryProps,
  ItemProps,
  ModifierProps,
  PriceGroupProps,
  PriceGroupItemProps,
  PriceGroupSchema,
} from '../../../../services/schemas';
import { routes } from '../../../../navigators/CheckoutItemNavigator';
import { realm } from '../../../../services/Realm';
import uuidv4 from 'uuid/v4';
import { PriceGroupContext } from '../../../../contexts/PriceGroupContext';
import { View, Grid, Col, Footer, FooterTab } from 'native-base';

export const CategoryList: React.FC = ({ navigation, route }) => {
  const { activeBill } = route.params;

  const { priceGroup } = useContext(PriceGroupContext);

  const categories = useRealmQuery<CategoryProps>({
    source: CategorySchema.name,
    sort: ['name'],
  });
  const items = useRealmQuery<ItemProps>({ source: ItemSchema.name });
  const modifiers = useRealmQuery<ModifierProps>({ source: ModifierSchema.name });

  const [searchValue, setSearchValue] = useState<string>('');

  const resolvePrice: (price: PriceGroupItemProps[], priceGroup: PriceGroupProps) => number = (price, priceGroup) =>
    price.find(({ groupId }) => groupId._id === priceGroup._id).price;

  const createBillItem = useCallback(
    (item, mods = []) => {
      console.log('creating bill item');
      const { _id: itemId, name, categoryId, modifierId, price } = item;
      console.log('adding priceGroup', priceGroup);

      const newModItems = mods.map(mod => {
        const { _id: modId, name, price } = mod;
        return {
          _id: uuidv4(),
          modId,
          name,
          price: resolvePrice(price, priceGroup),
        };
      });

      realm.write(() => {
        const modItems = newModItems.map(modItem => realm.create(BillItemModifierSchema.name, modItem));

        const newBillItem = {
          _id: uuidv4(),
          itemId,
          name,
          price: resolvePrice(price, priceGroup),
          modifierId: modifierId ? modifierId._id : null,
          mods: modItems,
          categoryId: categoryId._id,
          categoryName: categoryId.name,
          priceGroup,
        };

        realm.create(BillItemSchema.name, newBillItem);
        activeBill.items = [...activeBill.items, newBillItem];
      });
    },
    [activeBill, priceGroup],
  );

  const onPressCategoryFactory: (category?: CategoryProps) => () => void = category => () => {
    const filtered = category ? items.filtered(`categoryId._id = "${category._id}"`) : items;
    navigation.navigate(routes.categoryItemList, {
      category,
      items: filtered,
      modifiers,
      createBillItem,
    });
  };

  const onSearchHandler = (value: string) => setSearchValue(value);

  const searchFilter = (category: CategoryProps, searchValue: string) =>
    category.name.toLowerCase().includes(searchValue.toLowerCase());

  return (
    <Content>
      <SearchHeader onChangeText={onSearchHandler} value={searchValue} />

      <List>
        <ListItem itemHeader first>
          <Text style={{ fontWeight: 'bold' }}>Categories</Text>
        </ListItem>
        <ListItem key={'cat.all'} icon onPress={onPressCategoryFactory()}>
          <Left>
            <Text>All</Text>
          </Left>
          <Body>
            <Icon name="ios-arrow-forward" />
          </Body>
          <Right />
        </ListItem>
        {categories
          .filter(category => searchFilter(category, searchValue))
          .map(cat => {
            return (
              <ListItem key={cat._id} icon onPress={onPressCategoryFactory(cat)}>
                <Left>
                  <Text>{cat.name}</Text>
                </Left>
                <Body>
                  <Icon name="ios-arrow-forward" />
                </Body>
                <Right />
              </ListItem>
            );
          })}
      </List>
    </Content>
  );
};

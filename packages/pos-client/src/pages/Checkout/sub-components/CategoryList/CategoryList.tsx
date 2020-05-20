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
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';

export const CategoriesWrapped: React.FC<any> = ({ navigation, route, categories }) => {

  const [searchValue, setSearchValue] = useState<string>('');

  const onPressCategoryFactory: (category?: CategoryProps) => () => void = category => () => {
    if (!category) {
      navigation.navigate(routes.allItems, {
      });
    } else {
      navigation.navigate(routes.categoryItemList, {
        category,
      });
    }
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
          .map(category => {
            return (
              <ListItem key={category.id} icon onPress={onPressCategoryFactory(category)}>
                <Left>
                  <Text>{category.name}</Text>
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

export const Categories = withDatabase(
  withObservables([], ({ database }) => ({
    categories: database.collections
      .get('categories')
      .query()
      .observe(),
  }))(CategoriesWrapped),
);

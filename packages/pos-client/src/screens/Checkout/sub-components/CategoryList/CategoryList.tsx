import React, { useContext, useState } from 'react';
import { Text, Content, List, ListItem, Left, Icon, Body, Right } from '../../../../core';
import { SearchHeader } from '../../../../components/SearchHeader/SearchHeader';
import { CheckoutItemStackParamList } from '../../../../navigators/CheckoutItemNavigator';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { Database } from '@nozbe/watermelondb';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Category, PriceGroup } from '../../../../models';
import { PriceGroupContext } from '../../../../contexts/PriceGroupContext';

interface CategoriesInnerProps {
  categories: Category[];
}

interface CategoriesOuterProps {
  database: Database;
  route: RouteProp<CheckoutItemStackParamList, 'CategoryList'>;
  navigation: StackNavigationProp<CheckoutItemStackParamList, 'CategoryList'>;
}

export const CategoriesInner: React.FC<CategoriesOuterProps & CategoriesInnerProps> = ({ navigation, categories }) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const { priceGroup } = useContext(PriceGroupContext);

  const onPressCategoryFactory = (params: { category?: Category; priceGroup: PriceGroup }) => () => {
    const { category, priceGroup } = params;
    if (!category) {
      navigation.navigate('AllItemsList', {
        priceGroup,
      });
    } else {
      navigation.navigate('CategoryItemsList', {
        category,
        priceGroup,
      });
    }
  };

  const onSearchHandler = (value: string) => setSearchValue(value);

  const searchFilter = (category: Category, searchValue: string) =>
    category.name.toLowerCase().includes(searchValue.toLowerCase());

  return (
    <Content>
      <SearchHeader onChangeText={onSearchHandler} value={searchValue} />
      <List>
        <ListItem itemHeader first>
          <Text style={{ fontWeight: 'bold' }}>Categories</Text>
        </ListItem>
        <ListItem key={'cat.all'} icon onPress={onPressCategoryFactory({ priceGroup })}>
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
              <ListItem key={category.id} icon onPress={onPressCategoryFactory({ category, priceGroup })}>
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

export const Categories = withDatabase<any>(
  withObservables<CategoriesOuterProps, CategoriesInnerProps>([], ({ database }) => ({
    categories: database.collections.get('categories').query(),
  }))(CategoriesInner),
);

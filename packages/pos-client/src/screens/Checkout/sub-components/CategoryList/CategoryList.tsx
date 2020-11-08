import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useState } from 'react';
import { ScrollView } from 'react-native';
import { SearchHeader } from '../../../../components/SearchHeader/SearchHeader';
import { PriceGroupContext } from '../../../../contexts/PriceGroupContext';
import { Body, Container, Icon, Left, List, ListItem, Right, Text } from '../../../../core';
import { Category, PriceGroup } from '../../../../models';
import { CheckoutItemStackParamList } from '../../../../navigators/CheckoutItemNavigator';

interface CategoriesInnerProps {
  categories: Category[];
}

interface CategoriesOuterProps {
  database: Database;
  route: RouteProp<CheckoutItemStackParamList, 'CategoryList'>;
  navigation: StackNavigationProp<CheckoutItemStackParamList, 'CategoryList'>;
}

export const CategoriesInner: React.FC<CategoriesOuterProps & CategoriesInnerProps> = ({
  navigation,
  categories: c,
}) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const { priceGroup } = useContext(PriceGroupContext);

  const onPressCategoryFactory = (params: { category?: Category; priceGroup: PriceGroup }) => () => {
    const { category, priceGroup } = params;
    if (!category) {
      navigation.navigate('AllItemsList', {
        priceGroupId: priceGroup.id,
      });
    } else {
      navigation.navigate('CategoryItemsList', {
        category,
        priceGroupId: priceGroup.id,
      });
    }
  };

  const categories = [...c, ...c, ...c, ...c];

  const onSearchHandler = (value: string) => setSearchValue(value);

  const searchFilter = (category: Category, searchValue: string) =>
    category.name.toLowerCase().includes(searchValue.toLowerCase());

  return (
    <Container>
      <SearchHeader onChangeText={onSearchHandler} value={searchValue} />
      <ListItem itemHeader first>
        <Text style={{ fontWeight: 'bold' }}>Categories</Text>
      </ListItem>
      <ScrollView>
        <List>
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
      </ScrollView>
    </Container>
  );
};

export const Categories = withDatabase<any>(
  withObservables<CategoriesOuterProps, CategoriesInnerProps>([], ({ database }) => ({
    categories: database.collections.get('categories').query(),
  }))(CategoriesInner),
);

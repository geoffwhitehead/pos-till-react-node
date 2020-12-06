import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { groupBy, times } from 'lodash';
import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SearchHeader } from '../../../../components/SearchHeader/SearchHeader';
import { ItemsContext } from '../../../../contexts/ItemsContext';
import { OrganizationContext } from '../../../../contexts/OrganizationContext';
import { PriceGroupContext } from '../../../../contexts/PriceGroupContext';
import { Body, Button, Col, Container, Grid, Icon, Left, List, ListItem, Right, Row, Text } from '../../../../core';
import { Category, PriceGroup } from '../../../../models';
import { CategoryViewTypeEnum } from '../../../../models/Organization';
import { CheckoutItemStackParamList } from '../../../../navigators/CheckoutItemNavigator';
import { fontSizes } from '../../../../theme';
import { GRID_SPACING } from '../../../../utils/consts';

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
  const { organization } = useContext(OrganizationContext);
  const { groupedSortedItems, setCategoryItems } = useContext(ItemsContext);

  console.log('RENDER');
  const onPressCategoryFactory = (params: { category: Category; priceGroup: PriceGroup }) => () => {
    const { category, priceGroup } = params;
    setCategoryItems(groupedSortedItems[category.id]);
    navigation.navigate('CategoryItemsList', {
      priceGroupId: priceGroup.id,
    });
  };

  const onSearchHandler = (value: string) => setSearchValue(value);

  const searchFilter = (category: Category, searchValue: string) =>
    category.name.toLowerCase().includes(searchValue.toLowerCase());

  const isListView = organization.categoryViewType === CategoryViewTypeEnum.list;
  const isGridView = organization.categoryViewType === CategoryViewTypeEnum.grid;

  const gridSize = organization.categoryGridSize;

  const searchedCategories = categories.filter(category => searchFilter(category, searchValue));

  const groupedCategoriesByPosition = groupBy(searchedCategories, category => category.positionIndex);

  return (
    <Container>
      <SearchHeader onChangeText={onSearchHandler} value={searchValue} />
      <ListItem itemHeader first>
        <Text style={{ fontWeight: 'bold' }}>Categories</Text>
      </ListItem>

      {isListView && (
        <ScrollView>
          <List>
            {searchedCategories.map(category => {
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
      )}

      {isGridView && (
        <Grid style={styles.grid}>
          {times(gridSize, row => {
            return (
              <Row key={row} style={styles.row}>
                {times(gridSize, column => {
                  const position = gridSize * row + column;
                  const group = groupedCategoriesByPosition[position];
                  const category = group && group[0];
                  return (
                    <Col key={`${row}-${column}`} style={styles.col}>
                      {category && (
                        <Button
                          style={{ ...styles.button, backgroundColor: category.backgroundColor }}
                          info
                          onPress={onPressCategoryFactory({ priceGroup, category })}
                        >
                          <Text
                            style={{
                              ...styles.buttonText,
                              fontSize: gridSize > 4 ? fontSizes[4] : fontSizes[5],
                              color: category.textColor,
                            }}
                          >
                            {category.name}
                          </Text>
                        </Button>
                      )}
                    </Col>
                  );
                })}
              </Row>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export const Categories = withDatabase<any>(
  withObservables<CategoriesOuterProps, CategoriesInnerProps>([], ({ database }) => ({
    categories: database.collections
      .get('categories')
      .query()
      .observeWithColumns(['position_index']),
  }))(CategoriesInner),
);

const styles = StyleSheet.create({
  grid: {
    padding: GRID_SPACING,
    height: '100%',
    width: '100%',
  },
  row: {
    paddingTop: GRID_SPACING,
    paddingBottom: GRID_SPACING,
  },
  col: {
    paddingLeft: GRID_SPACING,
    paddingRight: GRID_SPACING,
  },
  button: {
    height: '100%',
    width: '100%',

    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 4,
    shadowColor: 'whitesmoke',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 2,
      width: 4,
    },
  },
  buttonText: {
    width: '100%',
    textAlign: 'center',

    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
} as const);

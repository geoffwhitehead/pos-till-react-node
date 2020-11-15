import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { groupBy, times } from 'lodash';
import React, { useContext, useState } from 'react';
import { ScrollView } from 'react-native';
import { SearchHeader } from '../../../../components/SearchHeader/SearchHeader';
import { OrganizationContext } from '../../../../contexts/OrganizationContext';
import { PriceGroupContext } from '../../../../contexts/PriceGroupContext';
import { Body, Button, Col, Container, Grid, Icon, Left, List, ListItem, Right, Row, Text } from '../../../../core';
import { Category, PriceGroup } from '../../../../models';
import { CategoryViewTypeEnum } from '../../../../models/Organization';
import { CheckoutItemStackParamList } from '../../../../navigators/CheckoutItemNavigator';
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

  const onSearchHandler = (value: string) => setSearchValue(value);

  const searchFilter = (category: Category, searchValue: string) =>
    category.name.toLowerCase().includes(searchValue.toLowerCase());

  const isListView = organization.categoryViewType === CategoryViewTypeEnum.list;
  const isGridView = organization.categoryViewType === CategoryViewTypeEnum.grid;

  const gridSize = organization.categoryGridSize;

  const groupedCategoriesByPosition = groupBy(categories, category => category.positionIndex);

  return (
    <Container>
      <SearchHeader onChangeText={onSearchHandler} value={searchValue} />
      <ListItem itemHeader first>
        <Text style={{ fontWeight: 'bold' }}>Categories</Text>
      </ListItem>

      {isListView && (
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
      )}

      {isGridView && (
        <Grid style={styles.grid}>
          {times(gridSize, row => {
            return (
              <Row style={styles.row}>
                {times(gridSize, column => {
                  const position = gridSize * row + column;
                  const group = groupedCategoriesByPosition[position];
                  const category = group && group[0];
                  return (
                    <Col style={styles.col}>
                      {category && (
                        <Button
                          style={{ ...styles.button, backgroundColor: category.backgroundColor }}
                          info
                          onPress={onPressCategoryFactory({ priceGroup, category })}
                        >
                          <Text style={{ ...styles.text, color: category.textColor }}>{category.name}</Text>
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

const styles = {
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
  },
  text: {
    fontSize: 25,
    width: '100%',
    textAlign: 'center',
  },
} as const;

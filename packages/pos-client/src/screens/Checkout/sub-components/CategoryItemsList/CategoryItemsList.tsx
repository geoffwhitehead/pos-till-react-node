import { Database, Q } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { groupBy, keyBy, sortBy } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Loading } from '../../../../components/Loading/Loading';
import { Modal } from '../../../../components/Modal/Modal';
import { SearchHeader } from '../../../../components/SearchHeader/SearchHeader';
import { CurrentBillContext } from '../../../../contexts/CurrentBillContext';
import { OrganizationContext } from '../../../../contexts/OrganizationContext';
import { Button, Icon, Left, List, ListItem, Text } from '../../../../core';
import { Category, Item, ItemPrice, Modifier, PriceGroup, tableNames } from '../../../../models';
import { CheckoutItemStackParamList } from '../../../../navigators/CheckoutItemNavigator';
import { CategoryItemRow } from './sub-components/CategoryItemRow';
import { ModifierList } from './sub-components/ModifierList/ModifierList';

interface CategoryItemsListOuterProps {
  database?: Database;
  category?: Category;
  modifiers: Modifier[];
  route:
    | RouteProp<CheckoutItemStackParamList, 'CategoryItemsList'>
    | RouteProp<CheckoutItemStackParamList, 'AllItemsList'>;
  navigation:
    | StackNavigationProp<CheckoutItemStackParamList, 'CategoryItemsList'>
    | StackNavigationProp<CheckoutItemStackParamList, 'AllItemsList'>;
  priceGroupId: PriceGroup;
}

interface CategoryItemsListInnerProps {
  items: Item[];
  prices: ItemPrice[];
  priceGroup: PriceGroup;
}

const CategoryItemsInner: React.FC<CategoryItemsListOuterProps & CategoryItemsListInnerProps> = ({
  category,
  items,
  navigation,
  prices,
  priceGroup,
  database,
}) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item>();
  const [sortedItems, setSortedItems] = useState<Record<string, Item[]>>();
  const [keyedPrices, setKeyedPrices] = useState<Record<string, ItemPrice>>();
  const {
    organization: { currency },
  } = useContext(OrganizationContext);
  const { currentBill } = useContext(CurrentBillContext);

  const goBack = () => navigation.goBack();

  const searchFilter = (item: Item, searchValue: string) => item.name.toLowerCase().includes(searchValue.toLowerCase());

  const onSearchHandler = (value: string) => setSearchValue(value);
  const onCancelHandler = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const onSelectItem = async (item: Item, modifierCount: number) => {
    if (modifierCount > 0) {
      setSelectedItem(item);
      setModalOpen(true);
    } else {
      await database.action(() => currentBill.addItems({ item, priceGroup, quantity: 1, selectedModifiers: [] }));
    }
  };

  useEffect(() => {
    const keyedPrices = keyBy(prices, price => price.itemId);
    const searchedItems = items.filter(item => searchFilter(item, searchValue));
    const filteredItems = searchedItems.filter(item => !!keyedPrices[item.id]);
    const filteredSortedItems = sortBy(filteredItems, item => item.name);
    const groupedSorteditems = groupBy(filteredSortedItems, item => item.name[0]);
    setSortedItems(groupedSorteditems);
    setKeyedPrices(keyedPrices);
  }, [items, prices, setKeyedPrices, setSortedItems, searchValue]);

  if (!keyedPrices || !sortedItems) {
    return <Loading />;
  }

  return (
    <>
      <ListItem itemHeader first>
        <Left>
          <Button bordered info onPress={goBack} iconLeft>
            <Icon name="ios-arrow-back" />
            <Text style={{ fontWeight: 'bold' }}>{`${category ? category.name : 'All'} / Items`}</Text>
          </Button>
        </Left>
      </ListItem>
      <SearchHeader onChangeText={onSearchHandler} value={searchValue} />
      <ScrollView>
        <List>
          {Object.keys(sortedItems).map(key => {
            return (
              <>
                <ListItem key={`${key}-divider`} itemDivider style={{ backgroundColor: 'lightgrey' }}>
                  <Text>{key}</Text>
                </ListItem>
                {sortedItems[key].map(item => {
                  const itemPrice = keyedPrices[item.id];
                  return (
                    <CategoryItemRow
                      key={item.id}
                      item={item}
                      itemPrice={itemPrice}
                      isActive={selectedItem === item}
                      onPressItem={onSelectItem}
                      currency={currency}
                    />
                  );
                })}
              </>
            );
          })}
        </List>
      </ScrollView>
      <Modal onClose={onCancelHandler} isOpen={modalOpen} style={{ width: 600 }}>
        <ModifierList priceGroup={priceGroup} currentBill={currentBill} onClose={onCancelHandler} item={selectedItem} />
      </Modal>
    </>
  );
};

export const CategoryItems = withDatabase<any>(
  withObservables<CategoryItemsListOuterProps, CategoryItemsListInnerProps>(['route'], ({ route, database }) => {
    const { category, priceGroupId } = route.params as CheckoutItemStackParamList['CategoryItemsList'];
    return {
      priceGroup: database.collections.get<PriceGroup>(tableNames.priceGroups).findAndObserve(priceGroupId),
      items: category.items.observeWithColumns(['name']),
      prices: database.collections.get<ItemPrice>(tableNames.itemPrices).query(Q.where('price_group_id', priceGroupId)),
    };
  })(CategoryItemsInner),
);

export const AllItems = withDatabase<any>(
  withObservables<CategoryItemsListOuterProps, CategoryItemsListInnerProps>(['route'], ({ database, route }) => {
    const { priceGroupId } = route.params as CheckoutItemStackParamList['AllItemsList'];
    return {
      priceGroup: database.collections.get<PriceGroup>(tableNames.priceGroups).findAndObserve(priceGroupId),
      items: database.collections
        .get<Item>(tableNames.items)
        .query(Q.on(tableNames.itemPrices, [Q.where('price_group_id', priceGroupId), Q.where('price', Q.notEq(null))])),
      prices: database.collections
        .get<ItemPrice>(tableNames.itemPrices)
        .query(Q.and(Q.where('price', Q.notEq(null)), Q.where('price_group_id', priceGroupId)))
        .observeWithColumns(['price']),
    };
  })(CategoryItemsInner),
);

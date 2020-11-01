import React, { useState, useContext, useEffect } from 'react';
import { Text, Content, List, ListItem, Left, Icon, Body, Right } from '../../../../core';
import { SearchHeader } from '../../../../components/SearchHeader/SearchHeader';
import { ModifierList } from './sub-components/ModifierList/ModifierList';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { CurrentBillContext } from '../../../../contexts/CurrentBillContext';
import { CategoryItemRow } from './sub-components/CategoryItemRow';
import { Category, Item, Modifier, ItemPrice, tableNames, PriceGroup } from '../../../../models';
import { StackNavigationProp } from '@react-navigation/stack';
import { CheckoutItemStackParamList } from '../../../../navigators/CheckoutItemNavigator';
import { RouteProp } from '@react-navigation/native';
import { Database, Q } from '@nozbe/watermelondb';
import { Loading } from '../../../../components/Loading/Loading';
import { groupBy, keyBy, sortBy } from 'lodash';
import { OrganizationContext } from '../../../../contexts/OrganizationContext';
import { Modal } from '../../../../components/Modal/Modal';

interface CategoryItemsListOuterProps {
  database?: Database;
  category?: Category;
  modifiers: Modifier[];
  route: RouteProp<CheckoutItemStackParamList, 'CategoryItemsList'>;
  navigation: StackNavigationProp<CheckoutItemStackParamList, 'CategoryItemsList'>;
  priceGroup: PriceGroup;
}

interface CategoryItemsListInnerProps {
  items: Item[];
  prices: ItemPrice[];
}

const CategoryItemsInner: React.FC<CategoryItemsListOuterProps & CategoryItemsListInnerProps> = ({
  category,
  items,
  navigation,
  prices,
  route: {
    params: { priceGroup },
  },
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
      await currentBill.addItem({ item, priceGroup });
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
        {Object.keys(sortedItems).map(key => {
          const elements = [
            <ListItem itemDivider style={{ backgroundColor: 'lightgrey' }}>
              <Text>{key}</Text>
            </ListItem>,
            ...sortedItems[key].map(item => {
              // this should always succeed
              const { price } = keyedPrices[item.id];
              return (
                <CategoryItemRow
                  key={item.id}
                  item={item}
                  price={price}
                  isActive={selectedItem === item}
                  onPressItem={onSelectItem}
                  currency={currency}
                />
              );
            }),
          ];

          return elements;
        })}
      </List>
      <Modal onClose={onCancelHandler} isOpen={modalOpen}>
        <ModifierList priceGroup={priceGroup} currentBill={currentBill} onClose={onCancelHandler} item={selectedItem} />
      </Modal>
    </Content>
  );
};

export const CategoryItems = withDatabase<any>(
  withObservables<CategoryItemsListOuterProps, CategoryItemsListInnerProps>(['route'], ({ route, database }) => {
    const { category, priceGroup } = route.params;
    return {
      category,
      items: category.items.observeWithColumns(['name']),
      prices: database.collections
        .get<ItemPrice>(tableNames.itemPrices)
        .query(Q.where('price_group_id', priceGroup.id))
        .observeWithColumns(['price']),
    };
  })(CategoryItemsInner),
);

export const AllItems = withDatabase<any>( // TODO: type
  withObservables<CategoryItemsListOuterProps, CategoryItemsListInnerProps>(['route'], ({ database, route }) => {
    const { priceGroup } = route.params;
    return {
      items: database.collections
        .get<Item>(tableNames.items)
        .query()
        .observeWithColumns(['name']),
      prices: database.collections
        .get<ItemPrice>(tableNames.itemPrices)
        .query(Q.where('price_group_id', priceGroup.id))
        .observeWithColumns(['price']),
    };
  })(CategoryItemsInner),
);

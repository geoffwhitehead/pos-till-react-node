import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Dictionary, groupBy, sortBy } from 'lodash';
import React, { memo, useContext, useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Modal } from '../../../../components/Modal/Modal';
import { SearchHeader } from '../../../../components/SearchHeader/SearchHeader';
import { CurrentBillContext } from '../../../../contexts/CurrentBillContext';
import { ItemPricesContext } from '../../../../contexts/ItemPricesContext';
import { ItemsContext } from '../../../../contexts/ItemsContext';
import { OrganizationContext } from '../../../../contexts/OrganizationContext';
import { Button, Left, List, ListItem, Text, View } from '../../../../core';
import { Category, Item, ItemPrice, Modifier, PriceGroup, tableNames } from '../../../../models';
import { CheckoutItemStackParamList } from '../../../../navigators/CheckoutItemNavigator';
import { CategoryItemRow } from './sub-components/CategoryItemRow';
import { ModifierList } from './sub-components/ModifierList/ModifierList';

interface CategoryItemsListOuterProps {
  database?: Database;
  category: Category;
  modifiers: Modifier[];
  route: RouteProp<CheckoutItemStackParamList, 'CategoryItemsList'>;
  navigation: StackNavigationProp<CheckoutItemStackParamList, 'CategoryItemsList'>;
  priceGroupId: PriceGroup;
}

interface CategoryItemsListInnerProps {
  items: Item[];
  prices: ItemPrice[];
  priceGroup: PriceGroup;
}

const CategoryItemsInner: React.FC<CategoryItemsListOuterProps & CategoryItemsListInnerProps> = ({
  category,
  navigation,
  priceGroup,
  database,
}) => {
  const { groupedItemPrices } = useContext(ItemPricesContext);
  const [selectableItems, setSelectableItems] = useState([]);

  console.log('category', category);
  const { sortedItems } = useContext(ItemsContext);
  const [searchValue, setSearchValue] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item>();
  const [itemsToDisplay, setItemsToDisplay] = useState<Dictionary<Item[]>>({});
  // const [sortedItems, setSortedItems] = useState<Record<string, Item[]>>({});
  // const [keyedPrices, setKeyedPrices] = useState<Record<string, ItemPrice>>({});
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
    const filtered = sortedItems.filter(
      item => item.categoryId === category.id && !!groupedItemPrices?.[priceGroup.id]?.[item.id],
    );
    setSelectableItems(filtered);
  }, [groupedItemPrices, sortedItems, priceGroup, category]);

  useEffect(() => {
    const searchedItems = selectableItems.filter(item => searchFilter(item, searchValue));
    const filteredSortedItems = sortBy(searchedItems, item => item.name);
    const groupedSorteditems = groupBy(filteredSortedItems, item => item.name[0]);
    setItemsToDisplay(groupedSorteditems);
  }, [searchValue, selectableItems]);

  return (
    <>
      <ListItem itemHeader first>
        <Left>
          <Button small bordered info onPress={goBack} iconLeft>
            <Text style={{ fontWeight: 'bold' }}>Back</Text>
          </Button>
        </Left>
      </ListItem>
      <SearchHeader onChangeText={onSearchHandler} value={searchValue} />
      <ScrollView>
        <List>
          {Object.entries(itemsToDisplay).map(([key, items]) => {
            return (
              <View key={`${key}-divider`}>
                <ListItem itemDivider style={{ backgroundColor: 'lightgrey' }}>
                  <Text>{key}</Text>
                </ListItem>
                {items.map(item => {
                  const itemPrice = groupedItemPrices[priceGroup.id][item.id];
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
              </View>
            );
          })}
        </List>
      </ScrollView>
      <Modal onClose={onCancelHandler} isOpen={modalOpen}>
        <ModifierList priceGroup={priceGroup} currentBill={currentBill} onClose={onCancelHandler} item={selectedItem} />
      </Modal>
    </>
  );
};

const MemoCategoryItemsInner = memo(CategoryItemsInner);

export const CategoryItems = withDatabase<any>(
  withObservables<CategoryItemsListOuterProps, CategoryItemsListInnerProps>(['route'], ({ route, database }) => {
    const { category, priceGroupId } = route.params as CheckoutItemStackParamList['CategoryItemsList'];
    return {
      priceGroup: database.collections.get<PriceGroup>(tableNames.priceGroups).findAndObserve(priceGroupId),
      category,
      // items: category.items.extend(
      //   Q.on(tableNames.itemPrices, [Q.where('price_group_id', priceGroupId), Q.where('price', Q.notEq(null))]),
      // ),
      // prices: database.collections
      //   .get<ItemPrice>(tableNames.itemPrices)
      //   .query(
      //     Q.and(Q.where('price', Q.notEq(null)), Q.where('price_group_id', priceGroupId)),
      //     Q.on(tableNames.items, Q.where('category_id', category.id)),
      //   ),
    };
  })(MemoCategoryItemsInner),
);

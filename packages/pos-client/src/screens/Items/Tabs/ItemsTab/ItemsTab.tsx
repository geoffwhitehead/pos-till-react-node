import { Database, Query } from '@nozbe/watermelondb';
import { Content, List, Item as ItemComponent, Input, Icon, Text, View, Button } from '../../../../core';
import React, { useState, useEffect } from 'react';
import { Modal } from '../../../../components/Modal/Modal';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { Category, Item, Modifier, PrinterGroup, tableNames } from '../../../../models';
import { ItemsTabRow } from './ItemsTabRow';
import { ItemDetails } from './ItemDetails';
import { Loading } from '../../../../components/Loading/Loading';
import { keyBy } from 'lodash';
import { SearchBar } from '../../../../components/SearchBar/SearchBar';

interface ItemsTabOuterProps {
  database?: Database;
}

interface ItemsTabInnerProps {
  items: Item[];
  categories: Category[];
  printerGroups: PrinterGroup[];
  modifiers: Modifier[];
}

const ItemsTabInner: React.FC<ItemsTabOuterProps & ItemsTabInnerProps> = ({ items, database, categories }) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item>();
  const [keyedCategories, setKeyedCategories] = useState<Record<string, Category>>();

  useEffect(() => {
    categories?.length && setKeyedCategories(keyBy(categories, ({ id }) => id));
  }, [categories]);

  const searchFilter = (item: Item, searchValue: string) => item.name.toLowerCase().includes(searchValue.toLowerCase());

  const onSearchHandler = (value: string) => setSearchValue(value);

  const onCloseHandler = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const onSelectItem = async (item: Item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  if (!keyedCategories) {
    return <Loading />;
  }

  return (
    <View>
      <SearchBar
        value={searchValue}
        onPressCreate={() => setModalOpen(true)}
        onSearch={value => setSearchValue(value)}
      />
      <Content>
        <List>
          {items
            .filter(item => searchFilter(item, searchValue))
            .map((item, index) => {
              const categoryName = keyedCategories[item.categoryId].name;
              const subtitle = `Category: ${categoryName}`;

              return (
                <ItemsTabRow
                  index={index}
                  key={item.id}
                  item={item}
                  isActive={selectedItem === item}
                  onPressItem={onSelectItem}
                  title={item.name}
                  subtitle={subtitle}
                />
              );
            })}
        </List>
      </Content>
      <Modal isOpen={modalOpen} onClose={onCloseHandler}>
        <ItemDetails item={selectedItem} onClose={onCloseHandler} categories={categories} />
      </Modal>
    </View>
  );
};

export const ItemsTab = withDatabase<any>( // TODO: type
  withObservables<ItemsTabOuterProps, ItemsTabInnerProps>([], ({ database }) => ({
    items: database.collections.get<Item>(tableNames.items).query(),
    categories: database.collections.get<Category>('categories').query(),
  }))(ItemsTabInner),
);

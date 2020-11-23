import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { keyBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Loading } from '../../../../components/Loading/Loading';
import { Modal } from '../../../../components/Modal/Modal';
import { SearchBar } from '../../../../components/SearchBar/SearchBar';
import { Container, Footer, List, Text } from '../../../../core';
import { Category, Item, Modifier, PrinterGroup, tableNames } from '../../../../models';
import { ItemsTabRow } from './ItemsTabRow';
import { ItemDetails } from './ModalItemDetails';

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
    <Container>
      <SearchBar
        value={searchValue}
        onPressCreate={() => setModalOpen(true)}
        onSearch={value => setSearchValue(value)}
      />
      <ScrollView>
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
      </ScrollView>

      <Footer>
        <Text note>{`${items.length} Items`}</Text>
      </Footer>
      <Modal isOpen={modalOpen} onClose={onCloseHandler}>
        <ItemDetails item={selectedItem} onClose={onCloseHandler} categories={categories} />
      </Modal>
    </Container>
  );
};

export const ItemsTab = withDatabase<any>( // TODO: type
  withObservables<ItemsTabOuterProps, ItemsTabInnerProps>([], ({ database }) => ({
    items: database.collections.get<Item>(tableNames.items).query(),
    categories: database.collections.get<Category>('categories').query(),
  }))(ItemsTabInner),
);

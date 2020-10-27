import { Database, Query } from '@nozbe/watermelondb';
import { Content, List, Item as ItemComponent, Input, ListItem, Left, Icon, Text, Body, Right } from '../../../../core';
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { OrganizationContext } from '../../../../contexts/OrganizationContext';
import { SearchHeader } from '../../../../components/SearchHeader/SearchHeader';
import { Modal } from '../../../../components/Modal/Modal';
import { ModifierList } from '../../../Checkout/sub-components/CategoryItemsList/sub-components/ModifierList/ModifierList';
import { CategoryItemRow } from '../../../Checkout/sub-components/CategoryItemsList/sub-components/CategoryItemRow';
import { resolvePrice } from '../../../../helpers';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { Category, Item, Modifier, PrinterGroup, tableNames } from '../../../../models';
import { ItemsTabRow } from './ItemsTabRow';
import { ItemDetails } from './ItemDetails';
import { Loading } from '../../../../components/Loading/Loading';
import { keyBy } from 'lodash';

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
    <Content>
      <ItemComponent>
        <Icon name="ios-search" />
        <Input placeholder="Search" onChangeText={onSearchHandler} value={searchValue} />
      </ItemComponent>
      <Modal isOpen={modalOpen} onClose={onCloseHandler}>
        <ItemDetails item={selectedItem} onClose={onCloseHandler} />
      </Modal>

      <List>
        {items
          .filter(item => searchFilter(item, searchValue))
          .map(item => {
            const categoryName = keyedCategories[item.categoryId].name;

            const title = item.name;
            const subtitle = `Category: ${categoryName}`;

            return (
              <ItemsTabRow
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
  );
};

export const ItemsTab = withDatabase<any>( // TODO: type
  withObservables<ItemsTabOuterProps, ItemsTabInnerProps>([], ({ database }) => ({
    items: database.collections.get<Item>(tableNames.items).query(),
    categories: database.collections.get<Category>('categories').query(),
  }))(ItemsTabInner),
);

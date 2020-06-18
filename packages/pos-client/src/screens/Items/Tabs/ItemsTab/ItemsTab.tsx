import { Database } from '@nozbe/watermelondb';
import { Content, List, Item as ItemComponent, Input, ListItem, Left, Icon, Text, Body, Right } from '../../../../core';
import React, { useState, useContext } from 'react';
import { OrganizationContext } from '../../../../contexts/OrganizationContext';
import { SearchHeader } from '../../../../components/SearchHeader/SearchHeader';
import { Modal } from '../../../../components/Modal/Modal';
import { ModifierList } from '../../../Checkout/sub-components/CategoryItemsList/sub-components/ModifierList/ModifierList';
import { CategoryItemRow } from '../../../Checkout/sub-components/CategoryItemsList/sub-components/CategoryItemRow';
import { resolvePrice } from '../../../../helpers';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { Item, tableNames } from '../../../../models';
import { ItemsTabRow } from './ItemsTabRow';
import { ItemDetails } from './ItemDetails';

interface ItemsTabOuterProps {
  database?: Database;
}

interface ItemsTabInnerProps {
  items: Item[];
}


const ItemsTabInner: React.FC<ItemsTabOuterProps & ItemsTabInnerProps> = ({ items, database }) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item>();

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

  return (
    <Content>
      <ItemComponent>
        <Icon name="ios-search" />
        <Input placeholder="Search" onChangeText={onSearchHandler} value={searchValue} />
      </ItemComponent>
      <Modal isOpen={modalOpen} onClose={onCloseHandler}>
        <ItemDetails item={selectedItem} onClose={() => onCloseHandler} />
      </Modal>

      <List>
        {items
          .filter(item => searchFilter(item, searchValue))
          .map(item => {
            return (
              <ItemsTabRow key={item.id} item={item} isActive={selectedItem === item} onPressItem={onSelectItem} />
            );
          })}
      </List>
    </Content>
  );
};

export const ItemsTab = withDatabase<any>( // TODO: type
  withObservables<ItemsTabOuterProps, ItemsTabInnerProps>([], ({ database }) => ({
    items: database.collections.get<Item>('items').query(),
  }))(ItemsTabInner),
);

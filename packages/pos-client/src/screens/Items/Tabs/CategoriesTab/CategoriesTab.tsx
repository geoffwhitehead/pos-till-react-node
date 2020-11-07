import { Database } from '@nozbe/watermelondb';
import { Content, List, Text, View, Button, ListItem, Body, Right, Left } from '../../../../core';
import React, { useState } from 'react';
import { Modal } from '../../../../components/Modal/Modal';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { Category } from '../../../../models';
import { SearchBar } from '../../../../components/SearchBar/SearchBar';
import { ModalCategoryDetails } from './ModalCategoryDetails';
import { CategoryRow } from './CategoryRow';

interface CategoriesTabOuterProps {
  database?: Database;
}

interface CategoriesTabInnerProps {
  categories: Category[];
}

const CategoriesTabInner: React.FC<CategoriesTabOuterProps & CategoriesTabInnerProps> = ({ database, categories }) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>();

  const searchFilter = (category: Category, searchValue: string) =>
    category.name.toLowerCase().includes(searchValue.toLowerCase());

  const onCloseHandler = () => {
    setModalOpen(false);
    setSelectedCategory(null);
  };

  const onSelectCategory = async (category: Category) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  return (
    <View>
      <SearchBar
        value={searchValue}
        onPressCreate={() => setModalOpen(true)}
        onSearch={value => setSearchValue(value)}
      />
      <Content>
        <List>
          {categories
            .filter(category => searchFilter(category, searchValue))
            .map((category, index) => {
              return <CategoryRow key={category.id} index={index} category={category} onSelect={onSelectCategory} />;
            })}
        </List>
      </Content>
      <Modal isOpen={modalOpen} onClose={onCloseHandler}>
        <ModalCategoryDetails category={selectedCategory} onClose={onCloseHandler} />
      </Modal>
    </View>
  );
};

export const CategoriesTab = withDatabase(
  withObservables<CategoriesTabOuterProps, CategoriesTabInnerProps>([], ({ database }) => ({
    categories: database.collections.get<Category>('categories').query(),
  }))(CategoriesTabInner),
);

const styles = {
  modal: {
    width: 500,
    height: 500,
  },
};

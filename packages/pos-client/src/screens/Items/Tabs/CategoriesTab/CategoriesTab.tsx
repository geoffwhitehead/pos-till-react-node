import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Modal } from '../../../../components/Modal/Modal';
import { SearchBar } from '../../../../components/SearchBar/SearchBar';
import { List, View } from '../../../../core';
import { Category } from '../../../../models';
import { CategoryRow } from './CategoryRow';
import { ModalCategoryDetails, ModalCategoryDetailsInner } from './ModalCategoryDetails';

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

  const onPressCreate = () => setModalOpen(true);

  return (
    <View>
      <SearchBar value={searchValue} onPressCreate={onPressCreate} onSearch={value => setSearchValue(value)} />
      <ScrollView>
        <List>
          {categories
            .filter(category => searchFilter(category, searchValue))
            .map((category, index) => {
              return <CategoryRow key={category.id} index={index} category={category} onSelect={onSelectCategory} />;
            })}
        </List>
      </ScrollView>
      <Modal isOpen={modalOpen} onClose={onCloseHandler}>
        {selectedCategory ? (
          <ModalCategoryDetails category={selectedCategory} onClose={onCloseHandler} />
        ) : (
          <ModalCategoryDetailsInner category={selectedCategory} onClose={onCloseHandler} />
        )}
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
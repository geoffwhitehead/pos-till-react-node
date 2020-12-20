import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Loading } from '../../components/Loading/Loading';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
import { Container, Icon, Label, ListItem, Picker, Tab, Tabs, Text } from '../../core';
import { Category, tableNames } from '../../models';
import { SidebarDrawerStackParamList } from '../../navigators/SidebarNavigator';
import { CategoriesTab } from './Tabs/CategoriesTab/CategoriesTab';
import { ItemsTab } from './Tabs/ItemsTab/ItemsTab';
import { ModifiersTab } from './Tabs/ModifiersTab/ModifiersTab';
import { PriceGroupsTab } from './Tabs/PriceGroupsTab/PriceGroupsTab';

interface ItemsOuterProps {
  navigation: DrawerNavigationProp<SidebarDrawerStackParamList, 'Items'>;
  database: Database;
}

interface ItemsInnerProps {
  categories: Category[];
}

const ItemsInner: React.FC<ItemsInnerProps & ItemsOuterProps> = ({ navigation, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>(categories[0] || null);

  if (!categories) {
    return <Loading />;
  }

  return (
    <Container>
      <SidebarHeader title="Items" onOpen={() => navigation.openDrawer()} />
      <Tabs>
        <Tab heading="Items">
          <ListItem itemDivider style={styles.categoryPickerItem}>
            <Label>
              <Text style={styles.categoryPickerText}>Category: </Text>
            </Label>
            <Picker
              mode="dropdown"
              iosHeader="Select a category"
              iosIcon={<Icon name="chevron-down-outline" />}
              placeholder="Select a category"
              selectedValue={selectedCategory}
              onValueChange={c => setSelectedCategory(c)}
            >
              {categories.map(category => {
                return <Picker.Item key={category.id} label={category.name} value={category} />;
              })}
            </Picker>
          </ListItem>
          {selectedCategory && <ItemsTab category={selectedCategory} />}
          {!selectedCategory && <Text>Select a category to show items...</Text>}
        </Tab>
        <Tab heading="Categories">
          <CategoriesTab />
        </Tab>
        <Tab heading="Modifiers">
          <ModifiersTab />
        </Tab>
        <Tab heading="Prices">
          <PriceGroupsTab />
        </Tab>
      </Tabs>
    </Container>
  );
};

const styles = StyleSheet.create({
  categoryPickerItem: { paddingLeft: 15 },
  categoryPickerText: { color: 'grey' },
});

export const Items = withDatabase<{}>(
  withObservables<ItemsOuterProps, ItemsInnerProps>([], ({ database }) => ({
    categories: database.collections
      .get<Category>(tableNames.categories)
      .query()
      .observeWithColumns(['name']),
  }))(ItemsInner),
);

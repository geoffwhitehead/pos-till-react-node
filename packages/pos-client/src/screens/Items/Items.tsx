import { DrawerNavigationProp } from '@react-navigation/drawer';
import React from 'react';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
import { Container, Tab, Tabs } from '../../core';
import { SidebarDrawerStackParamList } from '../../navigators/SidebarNavigator';
import { CategoriesTab } from './Tabs/CategoriesTab/CategoriesTab';
import { ItemsTab } from './Tabs/ItemsTab/ItemsTab';
import { ModifiersTab } from './Tabs/ModifiersTab/ModifiersTab';
import { PriceGroupsTab } from './Tabs/PriceGroupsTab/PriceGroupsTab';

interface ItemsProps {
  navigation: DrawerNavigationProp<SidebarDrawerStackParamList, 'Items'>;
}

const Items: React.FC<ItemsProps> = ({ navigation }) => {
  return (
    <Container>
      <SidebarHeader title="Items" onOpen={() => navigation.openDrawer()} />
      <Tabs>
        <Tab heading="Items">
          <ItemsTab />
        </Tab>
        <Tab heading="Categories">
          <CategoriesTab />
        </Tab>
        <Tab heading="Modifiers">
          <ModifiersTab />
        </Tab>
        <Tab heading="Price Groups">
          <PriceGroupsTab />
        </Tab>
      </Tabs>
    </Container>
  );
};

export { Items };

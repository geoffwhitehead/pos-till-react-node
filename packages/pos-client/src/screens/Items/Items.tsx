import React from 'react';
import { Tab, Container, Content, Tabs } from '../../core';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { SidebarDrawerStackParamList } from '../../navigators/SidebarNavigator';
import { ItemsTab } from './Tabs/ItemsTab/ItemsTab';
import { CategoriesTab } from './Tabs/CategoriesTab/CategoriesTab';
import { ModifiersTab } from './Tabs/ModifiersTab/ModifiersTab';

interface ItemsProps {
  navigation: DrawerNavigationProp<SidebarDrawerStackParamList, 'Items'>;
}

const Items: React.FC<ItemsProps> = ({ navigation }) => {
  return (
    <Container>
      <SidebarHeader title="Items" onOpen={() => navigation.openDrawer()} />
      <Content>
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
        </Tabs>
      </Content>
    </Container>
  );
};

export { Items };

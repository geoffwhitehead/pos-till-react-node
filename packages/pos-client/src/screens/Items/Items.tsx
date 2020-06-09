import React, { Component, ReactElement } from 'react';
import { Text, Content, List, Separator, ListItem, Container } from '../../core';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { SidebarDrawerStackParamList } from '../../navigators/SidebarNavigator';
import { Database } from '@nozbe/watermelondb';
import { Loading } from '../../components/Loading/Loading';

interface ItemsInnerProps {
  items: any; // TODO: type
}

interface ItemsOuterProps {
  navigation: DrawerNavigationProp<SidebarDrawerStackParamList, 'Items'>;
  database: Database;
}

export const ItemsInner: React.FC<ItemsOuterProps & ItemsInnerProps> = ({ navigation, items }) => {
  const openDrawer = () => navigation.openDrawer();

  return !items ? (
    <Loading />
  ) : (
    <Container>
      <SidebarHeader title="Items" onOpen={openDrawer} />
      <Content>
        <List>
          {items.reduce((acc, item, index) => {
            const firstRecord = index === 0;
            const currentRecordIsNewCategory =
              !firstRecord && items[index - 1].categoryId.name !== item.categoryId.name;
            const Item = (
              <ListItem key={`${item._id}-li`}>
                <Text>{item.name}</Text>
              </ListItem>
            );
            const Seperator = (
              <Separator bordered key={`${item._id}-s`}>
                <Text>{item.categoryId.name}</Text>
              </Separator>
            );
            if (firstRecord || currentRecordIsNewCategory) {
              return [...acc, Seperator, Item];
            } else {
              return [...acc, Item];
            }
          }, [])}
        </List>
      </Content>
    </Container>
  );
};

const enhance = c =>
  withDatabase<any>( // TODO: fix type
    withObservables<ItemsOuterProps, ItemsInnerProps>([], ({ database }) => ({
      items: database.collections
        .get('items')
        .query()
        .observe(),
    }))(c),
  );

export const Items = enhance(ItemsInner);

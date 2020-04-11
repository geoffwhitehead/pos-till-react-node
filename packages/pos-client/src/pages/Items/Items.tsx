import React from 'react';
import { Text, Content, List, Separator, ListItem, Container } from '../../core';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
import { Loading } from '../Loading/Loading';
import { useRealmQuery } from 'react-use-realm';
import { ItemSchema } from '../../services/schemas';

export const Items = ({ navigation }) => {
  const items = useRealmQuery({
    source: ItemSchema.name,
    sort: ['categoryId.name', 'name'],
  });
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

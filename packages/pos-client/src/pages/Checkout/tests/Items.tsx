import React, { useState } from 'react';
import { Text, Content, List, ListItem, Left, Body, Right, Button, Separator } from '../../../core';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import withObservables from '@nozbe/with-observables';
import { sanitizedRaw } from '@nozbe/watermelondb/RawRecord';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';

export const ItemList: React.FC<any> = ({ items, links, printers, database }) => {
  // const create = async params => {
  //   await database.action(async () => {
  //     const printersCollection = database.collections.get('printers');

  //     await printersCollection.create(printer => {
  //       printer.name = params;
  //     });
  //   });
  // };
  const fetch = async item => {
    console.log('item', item);
    database.action(async () => {
      const a = await item.printers.fetch();
      console.log('-------- a', a);
    });
  };
  console.log('links', links);
  console.log('printers', printers);
  return (
    <Content>
      <List>
        <ListItem itemHeader>
          <Left>
            <Text>State</Text>
          </Left>
          <Body>
            <Text>Balance</Text>
          </Body>
          <Right>
            <Text>Total</Text>
          </Right>
        </ListItem>
        {items.map((m, index) => {
          fetch(m);
          return (
            <ListItem key={index}>
              <Left>
                <Text>name: {m.name}</Text>
              </Left>
              <Body>
                <Text></Text>
              </Body>
              <Right>
                <Text></Text>
              </Right>
            </ListItem>
          );
        })}
      </List>
      {/* <Button onPress={() => create('Test')}>
        <Text>Create</Text>
      </Button> */}
    </Content>
  );
};

export const Items = withDatabase(
  withObservables([], ({ database }) => ({
    items: database.collections
      .get('items')
      .query()
      .observe(),
    links: database.collections
      .get('item_printers')
      .query()
      .observe(),
    printers: database.collections
      .get('printers')
      .query()
      .observe(),
  }))(ItemList),
);

// export const Categories = enhance(CategoryList);

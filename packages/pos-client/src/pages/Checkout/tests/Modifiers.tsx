import React, { useState } from 'react';
import { Text, Content, List, ListItem, Left, Body, Right, Button, Separator } from '../../../core';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import withObservables from '@nozbe/with-observables';
import { sanitizedRaw } from '@nozbe/watermelondb/RawRecord';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';

export const ModifierList: React.FC<any> = ({ modifiersItems, database }) => {
  // const create = async params => {
  //   await database.action(async () => {
  //     const printersCollection = database.collections.get('printers');

  //     await printersCollection.create(printer => {
  //       printer.name = params;
  //     });
  //   });
  // };
  const fetchMod = async mod => {
    database.action(async () => {
      const a = await mod.modifier.fetch();
      console.log('-------- a', a);
    });
  };
  modifiersItems && modifiersItems[0] && fetchMod(modifiersItems[0]);
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
        {modifiersItems.map((m, index) => {
          console.log('mod', m);
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

export const Modifiers = withDatabase(
  withObservables([], ({ database }) => ({
    modifiersItems: database.collections
      .get('modifier_items')
      .query()
      .observe(),
  }))(ModifierList),
);

// export const Categories = enhance(CategoryList);

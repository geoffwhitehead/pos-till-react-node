import React, { useState } from 'react';
import { Text, Content, List, ListItem, Left, Body, Right, Button, Separator } from '../../../core';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import withObservables from '@nozbe/with-observables';
import { sanitizedRaw } from '@nozbe/watermelondb/RawRecord';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';

export const PrintersList: React.FC<any> = ({ printers, database }) => {
  // const create = async params => {
  //   await database.action(async () => {
  //     const printersCollection = database.collections.get('printers');

  //     await printersCollection.create(printer => {
  //       printer.name = params;
  //     });
  //   });
  // };

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
        {printers.map((p, index) => {
          console.log('pG', p);
          return (
            <ListItem key={index}>
              <Left>
                <Text>name: {p.name}</Text>
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

export const Printers = withDatabase(
  withObservables([], ({ database }) => ({
    printers: database.collections
      .get('printers')
      .query()
      .observe(),
  }))(PrintersList),
);

// export const Categories = enhance(CategoryList);

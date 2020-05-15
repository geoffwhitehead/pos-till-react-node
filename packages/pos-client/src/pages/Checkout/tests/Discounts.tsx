import React, { useState } from 'react';
import { Text, Content, List, ListItem, Left, Body, Right, Button, Separator } from '../../../core';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import withObservables from '@nozbe/with-observables';
import { sanitizedRaw } from '@nozbe/watermelondb/RawRecord';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';

export const DiscountList: React.FC<any> = ({ discounts, database }) => {
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
        {discounts.map((m, index) => {
          console.log('mod', m);
          console.log('m.name', m.name);
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

export const Discounts = withDatabase(
  withObservables([], ({ database }) => ({
    discounts: database.collections
      .get('discounts')
      .query()
      .observe(),
  }))(DiscountList),
);

// export const Categories = enhance(CategoryList);

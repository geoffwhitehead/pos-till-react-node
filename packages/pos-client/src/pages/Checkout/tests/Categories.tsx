import React, { useState } from 'react';
import { Text, Content, List, ListItem, Left, Body, Right, Button, Separator } from '../../../core';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import withObservables from '@nozbe/with-observables';
import { sanitizedRaw } from '@nozbe/watermelondb/RawRecord';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';

export const CategoryList: React.FC<any> = ({ categories, database }) => {
  const create = async params => {
    await database.action(async () => {
      const categoriesCollection = database.collections.get('categories');

      const c = await categoriesCollection.create(cat => {
        cat.name = params;
      });
    });
  };

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
        {categories.map((cat, index) => {
          return (
            <ListItem key={index}>
              <Left>
                <Text>name: {cat.name}</Text>
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
      <Button onPress={() => create('Test')}>
        <Text>Create</Text>
      </Button>
    </Content>
  );
};

export const Categories = withDatabase(
  withObservables([], ({ database }) => ({
    categories: database.collections
      .get('categories')
      .query()
      .observe(),
  }))(CategoryList),
);

// export const Categories = enhance(CategoryList);

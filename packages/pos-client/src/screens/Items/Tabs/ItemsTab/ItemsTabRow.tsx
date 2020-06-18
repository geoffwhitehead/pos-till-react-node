import { ListItem, Left, Text, Icon, Body, Right } from '../../../../core';
import React from 'react';
import withObservables from '@nozbe/with-observables';
import { StyleSheet } from 'react-native';
import { Item } from '../../../../models';

interface ItemsTabRowOuterProps {
  item: Item;
  isActive: boolean;
  onPressItem: (i: Item) => void;
}

interface ItemsTabRowInnerProps {
  item: Item;
}

const ItemsTabRowInner: React.FC<ItemsTabRowOuterProps & ItemsTabRowInnerProps> = ({ isActive, item, onPressItem }) => {
  return (
    <ListItem style={isActive && styles.activeRow} icon  onPress={() => onPressItem(item)}>
      <Left>
        <Text>{item.name}</Text>
      </Left>
      <Body/>
      <Right/>
    </ListItem>
  );
};

export const ItemsTabRow = withObservables<ItemsTabRowOuterProps, ItemsTabRowInnerProps>(['item'], ({ item }) => ({
  item,
}))(ItemsTabRowInner);

const styles = StyleSheet.create({
  activeRow: {
    backgroundColor: '#cde1f9',
  },
});

import { ListItem, Left, Text, Icon, Body, Right, Button } from '../../../../core';
import React from 'react';
import withObservables from '@nozbe/with-observables';
import { StyleSheet } from 'react-native';
import { Item } from '../../../../models';

interface ItemsTabRowOuterProps {
  item: Item;
  isActive: boolean;
  onPressItem: (i: Item) => void;
  title: string;
  subtitle: string;
}

interface ItemsTabRowInnerProps {
  item: Item;
}

const ItemsTabRowInner: React.FC<ItemsTabRowOuterProps & ItemsTabRowInnerProps> = ({
  children,
  isActive,
  item,
  title,
  subtitle,
  onPressItem,
}) => {
  return (
    <ListItem thumbnail>
      <Left></Left>
      <Body>
        <Text>{title}</Text>
        <Text note>{subtitle}</Text>
      </Body>
      <Right>
        <Button onPress={() => onPressItem(item)} transparent>
          <Text>View</Text>
        </Button>
      </Right>
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

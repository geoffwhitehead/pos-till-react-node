import withObservables from '@nozbe/with-observables';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Body, Button, Left, ListItem, Right, Text } from '../../../../core';
import { Item } from '../../../../models';

interface ItemsTabRowOuterProps {
  item: Item;
  isActive: boolean;
  onPressItem: (i: Item) => void;
  title: string;
  subtitle: string;
  index: number;
}

interface ItemsTabRowInnerProps {
  item: Item;
}

const ItemsTabRowInner: React.FC<ItemsTabRowOuterProps & ItemsTabRowInnerProps> = ({
  item,
  title,
  subtitle,
  onPressItem,
  index,
}) => {
  return (
    <ListItem>
      <Left style={styles.item}>
        <Text style={{ alignSelf: 'flex-start' }}>{`${index + 1}: ${title}`}</Text>
        <Text style={{ alignSelf: 'flex-start' }} note>
          {subtitle}
        </Text>
      </Left>
      <Body />
      <Right>
        <Button bordered info small onPress={() => onPressItem(item)} transparent>
          <Text>Edit</Text>
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
  item: {
    flexDirection: 'column',
  },
});

import withObservables from '@nozbe/with-observables';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Body, Icon, Left, ListItem, Right, Text } from '../../../../../core';
import { Item, ItemPrice } from '../../../../../models';
import { formatNumber } from '../../../../../utils';

interface CategoryItemRowOuterProps {
  item: Item;
  isActive: boolean;
  onPressItem: (i: Item, mCount: number) => void;
  itemPrice: ItemPrice;
  currency: string;
}

interface CategoryItemRowInnerProps {
  modifierCount: any;
}

const CategoryItemRowInner: React.FC<CategoryItemRowOuterProps & CategoryItemRowInnerProps> = ({
  isActive,
  item,
  modifierCount,
  onPressItem,
  itemPrice,
  currency,
}) => {
  const onPress = () => onPressItem(item, modifierCount);

  return (
    <ListItem style={isActive ? styles.activeRow : { backgroundColor: 'white' }} icon key={item.id} onPress={onPress}>
      <Left>
        <Text>{item.name}</Text>
      </Left>
      <Body>{modifierCount > 0 ? <Icon style={{ color: 'lightgrey' }} name="ios-arrow-forward" /> : null}</Body>
      <Right>
        <Text style={{ color: 'grey' }}>{formatNumber(itemPrice.price, currency)}</Text>
      </Right>
    </ListItem>
  );
};

export const CategoryItemRow = withObservables<CategoryItemRowOuterProps, CategoryItemRowInnerProps>(
  ['item', 'itemPrice'],
  ({ item, itemPrice }) => ({
    item,
    itemPrice,
    modifierCount: item.modifiers.observeCount(),
  }),
)(CategoryItemRowInner);

const styles = StyleSheet.create({
  activeRow: {
    backgroundColor: '#cde1f9',
  },
});

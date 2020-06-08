import React from 'react';
import withObservables from '@nozbe/with-observables';
import { ListItem, Left, Text, Icon, Body, Right } from '../../../../../core';
import { StyleSheet } from 'react-native';
import { resolvePrice } from '../../../../../helpers';
import { formatNumber } from '../../../../../utils';
import { Item, PriceGroup } from '../../../../../models';

// TODO : move this
const currencySymbol = '£';

interface CategoryItemRowOuterProps {
  item: Item;
  isActive: boolean;
  priceGroup: PriceGroup;
  onPressItem: (i: Item, mCount: number) => void;
}

interface CategoryItemRowInnerProps {
  prices: any; // TODO: type
  modifierCount: any;
}

const CategoryItemRowInner: React.FC<CategoryItemRowOuterProps & CategoryItemRowInnerProps> = ({
  isActive,
  item,
  prices,
  modifierCount,
  priceGroup,
  onPressItem,
}) => {
  const onPress = () => onPressItem(item, modifierCount);

  return (
    <ListItem style={isActive && styles.activeRow} icon key={item.id} onPress={onPress}>
      <Left>
        <Text>{item.name}</Text>
      </Left>
      <Body>{modifierCount > 0 ? <Icon name="ios-arrow-forward" /> : null}</Body>
      <Right>
        <Text style={{ color: 'grey' }}>{formatNumber(resolvePrice(priceGroup, prices), currencySymbol)}</Text>
      </Right>
    </ListItem>
  );
};

export const CategoryItemRow = withObservables<CategoryItemRowOuterProps, CategoryItemRowInnerProps>(['item'], ({ item }) => ({
  prices: item.prices,
  modifierCount: item.modifiers.observeCount(),
}))(CategoryItemRowInner);

const styles = StyleSheet.create({
  activeRow: {
    backgroundColor: '#cde1f9',
  },
});

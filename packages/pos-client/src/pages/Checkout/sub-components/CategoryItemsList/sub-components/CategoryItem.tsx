import React from 'react';
import withObservables from '@nozbe/with-observables';
import { ListItem, Left, Text, Icon, Body, Right } from '../../../../../core';
import { StyleSheet } from 'react-native';
import { resolvePrice } from '../../../../../helpers';
import { formatNumber } from '../../../../../utils';

// TODO : move this
const currencySymbol = '£';

interface CategoryItemProps {
  // TODO: types
  item: any;
  isActive: boolean;
  priceGroup: any;
  prices: any[];
  modifierCount: any;
  onPressItem: any;
}

const WrappedCategoryItem: React.FC<CategoryItemProps> = ({
  isActive,
  item,
  prices,
  modifierCount,
  priceGroup,
  onPressItem,
}) => {
  const onPress = () => onPressItem(item, modifierCount);

  return (
    <ListItem style={isActive && styles.activeRow} icon key={item._id} onPress={onPress}>
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

export const CategoryItem = withObservables<any, any>(['item'], ({ item }) => ({
  prices: item.prices,
  modifierCount: item.modifiers.observeCount(),
}))(WrappedCategoryItem);

const styles = StyleSheet.create({
  activeRow: {
    backgroundColor: '#cde1f9',
  },
});

import React from 'react';
import withObservables from '@nozbe/with-observables';
import { ListItem, Left, Text, Icon, Body, Right } from '../../../../../core';
import { StyleSheet } from 'react-native';
import { PriceGroupSchema } from '../../../../../services/schemas';

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

  console.log('prices', prices);
  const priceRecord = prices.find(p => p.priceGroupId === priceGroup.id);
  return (
    <ListItem style={isActive && styles.activeRow} icon key={item._id} onPress={onPress}>
      <Left>
        <Text>{item.name}</Text>
      </Left>
      <Body>{modifierCount > 0 ? <Icon name="ios-arrow-forward" /> : null}</Body>
      <Right>
        <Text>{priceRecord && priceRecord.price}</Text>
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

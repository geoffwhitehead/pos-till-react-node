import React from 'react';
import withObservables from '@nozbe/with-observables';
import { ListItem, Left, Body, Text, Right } from 'native-base';

interface ModifierItemProps {
  priceGroup: any;
  prices: any;
  modifierItem: any;
}
const WrappedModifierItem: React.FC<ModifierItemProps> = ({ modifierItem, priceGroup, prices }) => {
  const priceRecord = prices.find(p => p.priceGroupId === priceGroup.id);

  return (
    <ListItem>
      <Left>
        <Text>{modifierItem.name}</Text>
        <Body />
        <Right><Text>{priceRecord && priceRecord.price}</Text></Right>
      </Left>
    </ListItem>
  );
};

export const ModifierItem = withObservables<any, any>(['modifierItem'], ({ modifierItem }) => ({
  prices: modifierItem.prices,
}))(WrappedModifierItem);

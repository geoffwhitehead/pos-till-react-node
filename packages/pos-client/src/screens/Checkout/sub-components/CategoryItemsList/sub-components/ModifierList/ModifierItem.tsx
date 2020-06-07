import React from 'react';
import withObservables from '@nozbe/with-observables';
import { ListItem, Left, Body, Text, Right } from 'native-base';
import { resolvePrice } from '../../../../../../helpers';
import { formatNumber } from '../../../../../../utils';

// TODO : move this
const currencySymbol = '£';

interface ModifierItemProps {
  priceGroup: any;
  prices: any;
  modifierItem: any;
  onPress: any;
  selected: boolean;
}
const WrappedModifierItem: React.FC<ModifierItemProps> = ({ selected, modifierItem, priceGroup, prices, onPress }) => {
  const _onPress = () => onPress(modifierItem);

  return (
    <ListItem selected={selected} onPress={_onPress}>
      <Left>
        <Text>{modifierItem.name}</Text>
        <Body />
        <Right>
          <Text style={{color: 'grey'}}>{formatNumber(resolvePrice(priceGroup, prices), currencySymbol)}</Text>
        </Right>
      </Left>
    </ListItem>
  );
};

export const ModifierItem = withObservables<any, any>(['modifierItem'], ({ modifierItem }) => ({
  prices: modifierItem.prices,
}))(WrappedModifierItem);

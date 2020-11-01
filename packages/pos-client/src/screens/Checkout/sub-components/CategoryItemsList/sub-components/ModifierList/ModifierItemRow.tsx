import React, { useContext } from 'react';
import withObservables from '@nozbe/with-observables';
import { ListItem, Left, Body, Text, Right } from 'native-base';
import { formatNumber } from '../../../../../../utils';
import { PriceGroup, ModifierItem, ModifierPrice } from '../../../../../../models';
import { OrganizationContext } from '../../../../../../contexts/OrganizationContext';
import { Q } from '@nozbe/watermelondb';

interface ModifierItemRowOuterProps {
  priceGroup: PriceGroup;
  modifierItem: ModifierItem;
  onPress: (mI: ModifierItem) => void;
  selected: boolean;
}

interface ModifierItemRowInnerProps {
  prices: ModifierPrice[];
}

const ModifierItemRowInner: React.FC<ModifierItemRowOuterProps & ModifierItemRowInnerProps> = ({
  selected,
  modifierItem,
  prices,
  onPress,
}) => {
  const _onPress = () => onPress(modifierItem);

  const {
    organization: { currency },
  } = useContext(OrganizationContext);

  return (
    <ListItem selected={selected} onPress={_onPress}>
      <Left>
        <Text>{modifierItem.name}</Text>
        <Body />
        <Right>
          <Text style={{ color: 'grey' }}>{formatNumber(prices[0].price, currency)}</Text>
        </Right>
      </Left>
    </ListItem>
  );
};

export const ModifierItemRow = withObservables<ModifierItemRowOuterProps, ModifierItemRowInnerProps>(
  ['modifierItem', 'priceGroup'],
  ({ modifierItem, priceGroup }) => ({
    prices: modifierItem.prices.extend(Q.where('price_group_id', priceGroup.id)),
  }),
)(ModifierItemRowInner);

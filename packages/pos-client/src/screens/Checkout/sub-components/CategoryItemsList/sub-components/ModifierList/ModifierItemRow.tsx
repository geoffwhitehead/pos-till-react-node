import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import { Body, Left, ListItem, Right, Text } from 'native-base';
import React, { useContext } from 'react';
import { OrganizationContext } from '../../../../../../contexts/OrganizationContext';
import { ModifierItem, ModifierPrice, PriceGroup } from '../../../../../../models';
import { formatNumber } from '../../../../../../utils';

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

import React from 'react';
import withObservables from '@nozbe/with-observables';
import { ListItem, Left, Body, Text, Right } from 'native-base';
import { resolvePrice } from '../../../../../../helpers';
import { formatNumber } from '../../../../../../utils';
import { PriceGroup, ModifierItem } from '../../../../../../models';

// TODO : move this
const currencySymbol = '£';

interface ModifierItemRowOuterProps {
  priceGroup: PriceGroup;
  modifierItem: ModifierItem;
  onPress: (mI: ModifierItem) => void;
  selected: boolean;
}

interface ModifierItemRowInnerProps {
  prices: any; // TODO: type
}

const ModifierItemRowInner: React.FC<ModifierItemRowOuterProps & ModifierItemRowInnerProps> = ({
  selected,
  modifierItem,
  priceGroup,
  prices,
  onPress,
}) => {
  const _onPress = () => onPress(modifierItem);

  return (
    <ListItem selected={selected} onPress={_onPress}>
      <Left>
        <Text>{modifierItem.name}</Text>
        <Body />
        <Right>
          <Text style={{ color: 'grey' }}>{formatNumber(resolvePrice(priceGroup, prices), currencySymbol)}</Text>
        </Right>
      </Left>
    </ListItem>
  );
};

export const ModifierItemRow = withObservables<ModifierItemRowOuterProps, ModifierItemRowInnerProps>(
  ['modifierItem'],
  ({ modifierItem }) => ({
    prices: modifierItem.prices,
  }),
)(ModifierItemRowInner);

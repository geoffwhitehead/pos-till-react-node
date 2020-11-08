import withObservables from '@nozbe/with-observables';
import { Body, Left, ListItem, Right, Text } from 'native-base';
import React, { useContext } from 'react';
import { OrganizationContext } from '../../../../../../contexts/OrganizationContext';
import { ModifierItem, ModifierItemPrice } from '../../../../../../models';
import { formatNumber } from '../../../../../../utils';

interface ModifierItemRowOuterProps {
  modifierItem: ModifierItem;
  onPress: (mI: ModifierItem) => void;
  selected: boolean;
  modifierItemPrice: ModifierItemPrice;
  isDisabled: boolean;
}

interface ModifierItemRowInnerProps {}

const ModifierItemRowInner: React.FC<ModifierItemRowOuterProps & ModifierItemRowInnerProps> = ({
  selected,
  modifierItem,
  modifierItemPrice,
  isDisabled,
  onPress,
}) => {
  const {
    organization: { currency },
  } = useContext(OrganizationContext);

  const _onPress = () => onPress(modifierItem);
  const hasPriceSet = modifierItemPrice.price !== null;

  return (
    <ListItem selected={selected} onPress={_onPress} disabled={isDisabled}>
      <Left>
        <Text>{modifierItem.name}</Text>
        <Body />
        <Right>
          {hasPriceSet && <Text style={{ color: 'grey' }}>{formatNumber(modifierItemPrice.price, currency)}</Text>}
          {!hasPriceSet && <Text note>No price set</Text>}
        </Right>
      </Left>
    </ListItem>
  );
};

export const ModifierItemRow = withObservables<ModifierItemRowOuterProps, ModifierItemRowInnerProps>(
  ['modifierItem', 'modifierItemPrice'],
  ({ modifierItem, modifierItemPrice }) => ({
    modifierItemPrice,
    modifierItem,
  }),
)(ModifierItemRowInner);

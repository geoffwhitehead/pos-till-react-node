import { ListItem, Left, Content, Text, Right } from '../../../../../core';
import { capitalize } from 'lodash';
import React from 'react';
import { formatNumber } from '../../../../../utils';
import withObservables from '@nozbe/with-observables';
import { BillItem } from '../../../../../models';

// TODO: move into org and fetch from db or something
const currencySymbol = '£';

interface ItemBreakdownInnerProps {
  modifierItems: any;
}

interface ItemBreakdownOuterProps {
  item: BillItem;
  readonly: boolean;
  // selected: BillItem;
  onSelect: (i: BillItem) => void;
}

const ItemBreakdownInner: React.FC<ItemBreakdownOuterProps & ItemBreakdownInnerProps> = ({
  item,
  modifierItems,
  readonly,
  // selected,
  onSelect,
}) => {
  return (
    <ListItem noIndent key={item.id} onPress={() => !readonly && onSelect(item)}>
      <Left>
        <Content>
          <Text>{`${capitalize(item.itemName)}`}</Text>
          {modifierItems.map(m => (
            <Text key={`${m.id}-name`}>{`- ${m.modifierItemName}`}</Text>
          ))}
        </Content>
      </Left>
      <Right>
        <Text>{`${formatNumber(item.itemPrice, currencySymbol)}`}</Text>
        {modifierItems.map(m => (
          <Text key={`${m.id}-price`}>{formatNumber(m.modifierItemPrice, currencySymbol)}</Text>
        ))}
      </Right>
    </ListItem>
  );
};

export const ItemBreakdown = withObservables<ItemBreakdownOuterProps, ItemBreakdownInnerProps>(
  ['item'],
  ({ item }) => ({
    modifierItems: item.billItemModifierItems,
  }),
)(ItemBreakdownInner);

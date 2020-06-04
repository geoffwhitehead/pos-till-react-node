import { ListItem, Left, Content, Text, Right } from '../../../../../core';
import { capitalize } from 'lodash';
import React from 'react';
import { formatNumber } from '../../../../../utils';
import withObservables from '@nozbe/with-observables';

// TODO: move into org and fetch from db or something
const currencySymbol = '£';

const ItemBreakdownInner = ({ item, modifierItems, readonly, selected, onSelect }) => {
  return (
    <ListItem noIndent key={item.id} selected={selected === item} onPress={() => !readonly && onSelect(item)}>
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

export const ItemBreakdown = withObservables(['item'], ({ item }) => ({
  modifierItems: item.billItemModifierItems,
}))(ItemBreakdownInner);

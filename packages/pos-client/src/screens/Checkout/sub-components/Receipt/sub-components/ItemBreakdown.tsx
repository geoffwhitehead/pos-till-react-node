import { ListItem, Left, Content, Text, Right } from '../../../../../core';
import { capitalize } from 'lodash';
import React, { useContext, Fragment } from 'react';
import { formatNumber, getSymbol } from '../../../../../utils';
import withObservables from '@nozbe/with-observables';
import { BillItem, BillItemModifierItem } from '../../../../../models';
import { OrganizationContext } from '../../../../../contexts/OrganizationContext';

interface ItemBreakdownInnerProps {
  modifierItems: any; // TODO
}

interface ItemBreakdownOuterProps {
  item: BillItem;
  readonly: boolean;
  onSelect: (i: BillItem) => void;
}

const ItemBreakdownInner: React.FC<ItemBreakdownOuterProps & ItemBreakdownInnerProps> = ({
  item,
  modifierItems,
  readonly,
  onSelect,
}) => {
  const { organization } = useContext(OrganizationContext);
  const currencySymbol = getSymbol(organization.currency);

  const prefix = item.isVoided ? 'VOID ' : item.isComp ? 'COMP ' : '';
  const style = item.isVoided ? styles.void : item.isComp ? styles.comp : {};

  return (
    <ListItem
      style={item.printStatus && styles[item.printStatus]}
      noIndent
      key={item.id}
      onPress={() => !readonly && onSelect(item)}
    >
      <Left>
        <Content>
          <Text style={style}>{`${prefix}${capitalize(item.itemName)}`}</Text>

          {modifierItems.map(m => (
            <Text style={style} key={`${m.id}-name`}>{`- ${m.modifierItemName}`}</Text>
          ))}
        </Content>
      </Left>
      <Right>
        <Text style={style}>{`${formatNumber(item.isComp ? 0 : item.itemPrice, currencySymbol)}`}</Text>
        {modifierItems.map(m => (
          <Text style={style} key={`${m.id}-price`}>
            {formatNumber(item.isComp ? 0 : m.modifierItemPrice, currencySymbol)}
          </Text>
        ))}
      </Right>
    </ListItem>
  );
};

export const ItemBreakdown = withObservables<ItemBreakdownOuterProps, ItemBreakdownInnerProps>(
  ['item'],
  ({ item }) => ({
    item,
    modifierItems: item.modifierItemsIncVoids,
  }),
)(ItemBreakdownInner);

const styles = {
  success: {
    borderLeftColor: 'green',
    borderLeftWidth: 8,
  },
  pending: {
    borderLeftColor: 'yellow',
    borderLeftWidth: 8,
  },
  error: {
    borderLeftColor: 'red',
    borderLeftWidth: 8,
  },
  void_pending: {
    borderLeftColor: 'yellow',
    borderLeftWidth: 8,
  },
  void_error: {
    borderLeftColor: 'red',
    borderLeftWidth: 8,
  },
  void: {
    color: 'red',
  },
  comp: {
    color: 'grey',
  },
};

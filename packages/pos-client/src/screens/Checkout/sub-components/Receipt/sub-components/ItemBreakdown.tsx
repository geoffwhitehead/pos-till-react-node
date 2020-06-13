import { ListItem, Left, Content, Text, Right } from '../../../../../core';
import { capitalize } from 'lodash';
import React, { useContext } from 'react';
import { formatNumber } from '../../../../../utils';
import withObservables from '@nozbe/with-observables';
import { BillItem } from '../../../../../models';
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
  
  return (
    <ListItem
      style={item.printStatus && styles[item.printStatus]}
      noIndent
      key={item.id}
      onPress={() => !readonly && onSelect(item)}
    >
      <Left>
        <Content>
          {item.isVoided ? (
            <Text style={styles.void}>{`VOID ${capitalize(item.itemName)}`}</Text>
          ) : (
            <Text>{`${capitalize(item.itemName)}`}</Text>
          )}
          {modifierItems.map(m => (
            <Text style={item.isVoided ? styles.void : {}} key={`${m.id}-name`}>{`- ${m.modifierItemName}`}</Text>
          ))}
        </Content>
      </Left>
      <Right>
        <Text>{`${formatNumber(item.itemPrice, organization.currency)}`}</Text>
        {modifierItems.map(m => (
          <Text key={`${m.id}-price`}>{formatNumber(m.modifierItemPrice, organization.currency)}</Text>
        ))}
      </Right>
    </ListItem>
  );
};

export const ItemBreakdown = withObservables<ItemBreakdownOuterProps, ItemBreakdownInnerProps>(
  ['item'],
  ({ item }) => ({
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
};

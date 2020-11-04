import { ListItem, Left, Content, Text, Right } from '../../../../../core';
import { capitalize } from 'lodash';
import React, { useContext } from 'react';
import { formatNumber } from '../../../../../utils';
import withObservables from '@nozbe/with-observables';
import { BillItem, BillItemModifierItem, BillItemPrintLog, ModifierItem } from '../../../../../models';
import { OrganizationContext } from '../../../../../contexts/OrganizationContext';
import { PrintStatus } from '../../../../../models/BillItemPrintLog';

interface ItemBreakdownInnerProps {
  modifierItems: BillItemModifierItem[];
  printLogs: BillItemPrintLog[];
}

interface ItemBreakdownOuterProps {
  billItem: BillItem;
  readonly: boolean;
  onSelect: (i: BillItem) => void;
  status: PrintStatus;
}

const ItemBreakdownInner: React.FC<ItemBreakdownOuterProps & ItemBreakdownInnerProps> = ({
  billItem,
  modifierItems,
  readonly,
  onSelect,
  status,
}) => {
  const {
    organization: { currency },
  } = useContext(OrganizationContext);

  const prefix = billItem.isVoided ? 'VOID ' : billItem.isComp ? 'COMP ' : '';
  const style = billItem.isVoided ? styles.void : billItem.isComp ? styles.comp : {};
  const isChargable = !(billItem.isComp || billItem.isVoided);
  const itemDisplayPrice = formatNumber(isChargable ? billItem.itemPrice : 0, currency);
  return (
    <ListItem
      style={status ? styles[status] : {}}
      noIndent
      key={billItem.id}
      onPress={() => !readonly && onSelect(billItem)}
    >
      <Left>
        <Content>
          <Text style={style}>{`${prefix}${capitalize(billItem.itemName)}`}</Text>
          {modifierItems.map(m => (
            <Text style={style} key={`${m.id}-name`}>{`- ${m.modifierItemName}`}</Text>
          ))}
        </Content>
      </Left>
      <Right>
        <Text style={style}>{itemDisplayPrice}</Text>
        {modifierItems.map(m => {
          const modifierItemDisplayPrice = formatNumber(isChargable ? m.modifierItemPrice : 0, currency);
          return (
            <Text style={style} key={`${m.id}-price`}>
              {modifierItemDisplayPrice}
            </Text>
          );
        })}
      </Right>
    </ListItem>
  );
};

export const ItemBreakdown = withObservables<ItemBreakdownOuterProps, ItemBreakdownInnerProps>(
  ['billItem'],
  ({ billItem }) => ({
    billItem,
    modifierItems: billItem.billItemModifierItems,
  }),
)(ItemBreakdownInner);

const styles = {
  [PrintStatus.succeeded]: {
    borderLeftColor: 'green',
    borderLeftWidth: 8,
  },
  [PrintStatus.processing]: {
    borderLeftColor: 'yellow',
    borderLeftWidth: 8,
  },
  [PrintStatus.errored]: {
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

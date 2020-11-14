import withObservables from '@nozbe/with-observables';
import { capitalize } from 'lodash';
import React, { useContext } from 'react';
import { OrganizationContext } from '../../../../../contexts/OrganizationContext';
import { Left, ListItem, Right, Text, View } from '../../../../../core';
import { BillItem, BillItemModifierItem, BillItemPrintLog } from '../../../../../models';
import { PrintStatus } from '../../../../../models/BillItemPrintLog';
import { formatNumber } from '../../../../../utils';

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
  const isDisabled = readonly || status === PrintStatus.processing;
  return (
    <ListItem
      style={status ? styles[status] : {}}
      noIndent
      key={billItem.id}
      disabled={isDisabled}
      onPress={() => onSelect(billItem)}
    >
      <Left>
        <View>
          <Text style={style}>{`${prefix}${capitalize(billItem.itemName)}`}</Text>
          {modifierItems.map(m => (
            <Text note style={style} key={`${m.id}-name`}>{`- ${m.modifierItemName}`}</Text>
          ))}
        </View>
      </Left>
      <Right>
        <Text style={style}>{itemDisplayPrice}</Text>
        {modifierItems.map(m => {
          const modifierItemDisplayPrice = formatNumber(isChargable ? m.modifierItemPrice : 0, currency);
          return (
            <Text note style={style} key={`${m.id}-price`}>
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

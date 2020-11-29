import withObservables from '@nozbe/with-observables';
import { capitalize } from 'lodash';
import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { OrganizationContext } from '../../../../../contexts/OrganizationContext';
import { Badge, Left, ListItem, Right, Text, View } from '../../../../../core';
import { BillItem, BillItemModifierItem } from '../../../../../models';
import { PrintStatus } from '../../../../../models/BillItemPrintLog';
import { formatNumber } from '../../../../../utils';

interface ItemBreakdownInnerProps {}

interface ItemBreakdownOuterProps {
  billItem: BillItem;
  modifierItems: BillItemModifierItem[];
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

  const { isVoided, isComp } = billItem;
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={style}>{`${capitalize(billItem.itemName)}`}</Text>
            {isVoided && (
              <Badge danger style={{ marginLeft: 10 }}>
                <Text>Voiding</Text>
              </Badge>
            )}
            {isComp && (
              <Badge info style={{ marginLeft: 10 }}>
                <Text>Comp</Text>
              </Badge>
            )}
          </View>
          {modifierItems.length > 0 && (
            <View style={{ paddingTop: 5 }}>
              {modifierItems.map(m => (
                <Text note style={style} key={`${m.id}-name`}>{`- ${m.modifierItemName}`}</Text>
              ))}
            </View>
          )}
          {billItem.printMessage ? (
            <Text note style={{ ...style, fontWeight: 'bold' }}>{`msg: ${billItem.printMessage}`}</Text>
          ) : null}
        </View>
      </Left>
      <Right>
        <Text style={style}>{itemDisplayPrice}</Text>
        {modifierItems.length > 0 && (
          <View style={{ paddingTop: 5 }}>
            {modifierItems.map(m => {
              const modifierItemDisplayPrice = formatNumber(isChargable ? m.modifierItemPrice : 0, currency);
              return (
                <Text note style={style} key={`${m.id}-price`}>
                  {modifierItemDisplayPrice}
                </Text>
              );
            })}
          </View>
        )}
      </Right>
    </ListItem>
  );
};

export const ItemBreakdown = withObservables<ItemBreakdownOuterProps, ItemBreakdownInnerProps>(
  ['billItem'],
  ({ billItem }) => ({
    billItem,
  }),
)(ItemBreakdownInner);

const styles = StyleSheet.create({
  [PrintStatus.succeeded]: {
    borderLeftColor: 'green',
    borderLeftWidth: 4,
  },
  [PrintStatus.processing]: {
    borderLeftColor: 'yellow',
    borderLeftWidth: 4,
  },
  [PrintStatus.errored]: {
    borderLeftColor: 'red',
    borderLeftWidth: 4,
  },
  void: {
    color: 'red',
  },
  comp: {
    color: 'grey',
  },
});

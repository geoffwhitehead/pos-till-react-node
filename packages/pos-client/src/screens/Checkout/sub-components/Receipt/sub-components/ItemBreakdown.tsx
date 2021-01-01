import withObservables from '@nozbe/with-observables';
import { capitalize } from 'lodash';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Badge, Left, ListItem, Right, Text, View } from '../../../../../core';
import { BillItem, BillItemModifierItem } from '../../../../../models';
import { BillItemPrintLog, PrintStatus, PrintType } from '../../../../../models/BillItemPrintLog';
import { CurrencyEnum } from '../../../../../models/Organization';
import { formatNumber } from '../../../../../utils';
import { ITEM_SPACING } from '../../../../../utils/consts';

interface ItemBreakdownInnerProps {
  billItemModifierItems: BillItemModifierItem[];
  billItemPrintLogs: BillItemPrintLog[];
}

interface ItemBreakdownOuterProps {
  billItem: BillItem;
  readonly: boolean;
  onSelect: (i: BillItem) => void;
  currency: CurrencyEnum;
}

const ItemBreakdownInner: React.FC<ItemBreakdownOuterProps & ItemBreakdownInnerProps> = ({
  billItem,
  billItemModifierItems,
  readonly,
  onSelect,
  billItemPrintLogs,
  currency,
}) => {
  const [printStatus, setPrintStatus] = useState<PrintStatus>();
  const [isVoidComplete, setIsVoidComplete] = useState(false);

  useEffect(() => {
    const hasSucceeded =
      billItemPrintLogs.length > 0 && billItemPrintLogs.every(log => log.status === PrintStatus.succeeded);
    const hasErrored = billItemPrintLogs.some(log => log.status === PrintStatus.errored);
    const isProcessing = billItemPrintLogs.some(log => log.status === PrintStatus.processing);
    const isPending = billItemPrintLogs.some(log => log.status === PrintStatus.pending);

    const status = hasSucceeded
      ? PrintStatus.succeeded
      : hasErrored
      ? PrintStatus.errored
      : isProcessing
      ? PrintStatus.processing
      : isPending
      ? PrintStatus.pending
      : null;

    setPrintStatus(status);
  }, [billItemPrintLogs, setPrintStatus]);

  useEffect(() => {
    const voidedWithVoidLogs =
      billItem.isVoided &&
      billItemPrintLogs.some(log => log.type === PrintType.void && log.status === PrintStatus.succeeded);
    const voidedWithNoLogs = billItem.isVoided && billItemPrintLogs.length === 0;

    (voidedWithVoidLogs || voidedWithNoLogs) && setIsVoidComplete(true);
  }, [billItem.isVoided, billItemPrintLogs, printStatus]);

  if (isVoidComplete) {
    return null;
  }

  const { isVoided, isComp } = billItem;
  const style = billItem.isVoided ? styles.void : billItem.isComp ? styles.comp : {};
  const isChargable = !(billItem.isComp || billItem.isVoided);
  const itemDisplayPrice = formatNumber(isChargable ? billItem.itemPrice : 0, currency);
  const isDisabled = readonly || printStatus === PrintStatus.processing;
  const statusStyles = printStatus ? styles[printStatus] : {};

  return (
    <ListItem
      style={{ ...statusStyles, ...styles.listItem }}
      noIndent
      key={billItem.id}
      disabled={isDisabled}
      onPress={() => onSelect(billItem)}
    >
      <Left style={{ padding: 0 }}>
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
          {billItemModifierItems.length > 0 && (
            <View style={{ paddingTop: 5 }}>
              {billItemModifierItems.map(m => (
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
        {billItemModifierItems.length > 0 && (
          <View style={{ paddingTop: 5 }}>
            {billItemModifierItems.map(m => {
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
    billItemPrintLogs: billItem.billItemPrintLogs.observeWithColumns(['status']),
    billItemModifierItems: billItem.billItemModifierItems,
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
  listItem: {
    paddingTop: ITEM_SPACING,
    paddingBottom: ITEM_SPACING,
  },
});

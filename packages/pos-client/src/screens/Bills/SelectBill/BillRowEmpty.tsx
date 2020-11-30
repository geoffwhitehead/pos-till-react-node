import React from 'react';
import { StyleSheet } from 'react-native';
import { Body, Left, ListItem, Right, Text } from '../../../core';
import { Bill, BillPeriod } from '../../../models';
import { fontSizes } from '../../../theme';

interface BillRowEmptyProps {
  reference: number;
  onSelectBill: (b: Bill) => void;
  billPeriod: BillPeriod;
}

export const BillRowEmpty: React.FC<BillRowEmptyProps> = ({ onSelectBill, reference, billPeriod }) => {
  const createBill = async () => {
    const bill = await billPeriod.createBill({ reference });
    onSelectBill(bill);
  };

  return (
    <ListItem noIndent style={styles.closedBill} key={reference} onPress={createBill}>
      <Left>
        <Text style={styles.rowText}>{reference}</Text>
      </Left>
      <Body />
      <Right />
    </ListItem>
  );
};

const styles = StyleSheet.create({
  closedBill: {
    borderLeftColor: 'red',
    borderLeftWidth: 8,
  },
  rowText: {
    fontSize: fontSizes[3],
  },
} as const);

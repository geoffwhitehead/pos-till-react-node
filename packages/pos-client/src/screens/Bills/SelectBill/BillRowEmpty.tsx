import React from 'react';
import { StyleSheet } from 'react-native';
import { Body, Left, ListItem, Right, Text } from '../../../core';
import { fontSizes } from '../../../theme';

interface BillRowEmptyProps {
  reference: number;
  onCreateSelectBill: (reference: number) => void;
}

export const BillRowEmpty: React.FC<BillRowEmptyProps> = ({ onCreateSelectBill, reference }) => {
  return (
    <ListItem noIndent style={styles.closedBill} key={reference} onPress={() => onCreateSelectBill(reference)}>
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

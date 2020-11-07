import React from 'react';
import { Body, Left, ListItem, Right, Text } from '../../../core';
import { Bill, BillPeriod } from '../../../models';

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

const styles = {
  closedBill: {
    borderLeftColor: 'red',
    borderLeftWidth: 8,
  },
  rowText: {
    fontSize: 18,
  },
} as const;

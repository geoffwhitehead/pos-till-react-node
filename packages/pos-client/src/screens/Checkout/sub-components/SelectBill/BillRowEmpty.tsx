import React from 'react';
import { ListItem, Left, Text, Body, Right } from '../../../../core';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { Bill, BillPeriod } from '../../../../models';

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
    <ListItem key={reference} onPress={createBill}>
      <Left>
        <Text style={{ color: 'red' }}>{`${reference}: Closed`}</Text>
      </Left>
      <Body />
      <Right />
    </ListItem>
  );
};

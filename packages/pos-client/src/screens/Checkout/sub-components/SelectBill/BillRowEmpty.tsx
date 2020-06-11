import React from 'react';
import { ListItem, Left, Text, Body, Right } from '../../../../core';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { Bill, BillPeriod } from '../../../../models';

interface BillRowEmptyProps {
  reference: number;
  onSelectBill: (b: Bill) => void;
  billPeriod: BillPeriod;
  key: string;
}

export const BillRowEmpty: React.FC<BillRowEmptyProps> = ({ key, onSelectBill, reference, billPeriod }) => {
  const database = useDatabase();

  const createBill = async () => {
    const bill = await database.action<Bill>(async () => await billPeriod.createBill({ reference }));
    onSelectBill(bill);
  };

  return (
    <ListItem key={key} onPress={createBill}>
      <Left>
        <Text style={{ color: 'red' }}>{`${reference}: Closed`}</Text>
      </Left>
      <Body />
      <Right />
    </ListItem>
  );
};

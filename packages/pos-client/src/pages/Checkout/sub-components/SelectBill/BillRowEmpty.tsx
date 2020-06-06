import React from 'react';
import { ListItem, Left, Text, Body, Right } from '../../../../core';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { useDatabase } from '@nozbe/watermelondb/hooks';

interface BillRowEmptyProps {
  reference: string;
  onSelectBill: (bill: any) => void;
  billPeriod: any;
}

export const BillRowEmpty: React.FC<BillRowEmptyProps> = ({ onSelectBill, reference, billPeriod }) => {

  const database = useDatabase();

  const createBill = async () => {
    const bill = await database.action(async () => await billPeriod.createBill({ reference }));
    onSelectBill(bill);
  };

  return (
    <ListItem onPress={createBill}>
      <Left>
        <Text style={{ color: 'red' }}>{`${reference}: Closed`}</Text>
      </Left>
      <Body />
      <Right />
    </ListItem>
  );
};

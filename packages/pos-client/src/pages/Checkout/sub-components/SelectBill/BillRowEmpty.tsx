import React from 'react';
import withObservables from '@nozbe/with-observables';
import { ListItem, Left, Text, Body, Right } from '../../../../core';
import { formatNumber, balance, total } from '../../../../utils';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';

interface BillRowEmptyProps {
  reference: string;
  database: any;
  onSelectBill: (bill: any) => void;
  billPeriod: any;
}

const WrappedBillRowEmpty: React.FC<BillRowEmptyProps> = ({ onSelectBill, reference, database, billPeriod }) => {
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

export const BillRowEmpty = withDatabase(WrappedBillRowEmpty);

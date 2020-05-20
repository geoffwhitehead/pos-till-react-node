import React from 'react';
import { ListItem, Left, Text, Body, Right } from 'native-base';
import { formatNumber, balance, total } from '../../../../utils';

const symbol = '£'; // TODO: move to org settings

export const BillRow: React.FC<{ bill: any; onSelectBill: (bill: any) => void }> = ({ bill, onSelectBill }) => {
  const _onSelectBill = () => onSelectBill(bill);

  return (
    <ListItem onPress={_onSelectBill}>
      <Left>
        <Text style={{ color: 'green' }}>{`${bill.reference}: Open`}</Text>
      </Left>
      <Body>{/* <Text style={{ color: 'grey' }}>{formatNumber(balance(bill), symbol)}</Text> */}</Body>
      <Right>{/* <Text style={{ color: 'grey' }}>{formatNumber(total(bill), symbol)}</Text> */}</Right>
    </ListItem>
  );
};

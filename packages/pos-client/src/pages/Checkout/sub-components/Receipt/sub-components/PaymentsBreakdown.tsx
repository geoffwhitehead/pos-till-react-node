import React from 'react';
import { Separator, Text, ListItem, Left, Right } from '../../../../../core';
import { formatNumber } from '../../../../../utils';
import { capitalize } from 'lodash';

// TODO: move into org and fetch from db or something
const currencySymbol = '£';

const PaymentsBreakdown: React.FC<{
  payments: any;
  paymentTypes: any;
  readonly: boolean;
  selected: boolean;
  onSelect: (payment) => void;
}> = ({ payments, readonly, selected, onSelect, paymentTypes }) => {
  console.log('payments', payments);
  if (!payments || !payments.length) {
    return null;
  }

  const lookupPaymentType = paymentTypeId => paymentTypes.find(({ id }) => id === paymentTypeId);

  return (
    <>
      <Separator bordered>
        <Text>Payments</Text>
      </Separator>
      {payments
        .filter(payment => !payment.isChange)
        .map(payment => {
          const paymentType = lookupPaymentType(payment.paymentTypeId);
          return (
            <>
              <ListItem key={payment._id} selected={selected} onPress={() => onSelect(!readonly && payment)}>
                <Left>
                  <Text>{`Payment: ${capitalize(paymentType.name)}`}</Text>
                </Left>
                <Right>
                  <Text>{`${formatNumber(payment.amount, currencySymbol)}`}</Text>
                </Right>
              </ListItem>
            </>
          );
        })}
    </>
  );
};

export { PaymentsBreakdown };

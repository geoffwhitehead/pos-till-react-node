import React, { useContext } from 'react';
import { Separator, Text, ListItem, Left, Right } from '../../../../../core';
import { formatNumber } from '../../../../../utils';
import { capitalize } from 'lodash';
import { BillPayment, PaymentType } from '../../../../../models';
import { OrganizationContext } from '../../../../../contexts/OrganizationContext';

interface PaymentsBreakdownProps {
  payments: BillPayment[];
  paymentTypes: PaymentType[];
  readonly: boolean;
  onSelect: (bP: BillPayment) => void;
}

const PaymentsBreakdown: React.FC<PaymentsBreakdownProps> = ({ payments, readonly, onSelect, paymentTypes }) => {
  const { organization } = useContext(OrganizationContext);

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
              <ListItem key={payment.id} onPress={() => onSelect(!readonly && payment)}>
                <Left>
                  <Text>{`Payment: ${capitalize(paymentType.name)}`}</Text>
                </Left>
                <Right>
                  <Text>{`${formatNumber(payment.amount, organization.currency)}`}</Text>
                </Right>
              </ListItem>
            </>
          );
        })}
    </>
  );
};

export { PaymentsBreakdown };

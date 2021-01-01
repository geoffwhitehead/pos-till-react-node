import { capitalize, keyBy } from 'lodash';
import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { OrganizationContext } from '../../../../../contexts/OrganizationContext';
import { Left, ListItem, Right, Separator, Text } from '../../../../../core';
import { BillPayment, PaymentType } from '../../../../../models';
import { formatNumber } from '../../../../../utils';
import { ITEM_SPACING } from '../../../../../utils/consts';

interface PaymentsBreakdownProps {
  payments: BillPayment[];
  paymentTypes: PaymentType[];
  readonly: boolean;
  onSelect: (BillPayment: BillPayment) => void;
}

const PaymentsBreakdown: React.FC<PaymentsBreakdownProps> = ({ payments, readonly, onSelect, paymentTypes }) => {
  const {
    organization: { currency },
  } = useContext(OrganizationContext);

  if (!payments || !payments.length) {
    return null;
  }

  const keyedPaymentTypes = keyBy(paymentTypes, ({ id }) => id);

  return (
    <>
      <Separator bordered key="payment-separator">
        <Text>Payments</Text>
      </Separator>
      {payments
        .filter(payment => !payment.isChange)
        .map(payment => {
          const paymentType = keyedPaymentTypes[payment.paymentTypeId];
          return (
            <ListItem key={payment.id} onPress={() => !readonly && onSelect(payment)} style={styles.listItem}>
              <Left>
                <Text>{`Payment: ${capitalize(paymentType.name)}`}</Text>
              </Left>
              <Right>
                <Text>{`${formatNumber(payment.amount, currency)}`}</Text>
              </Right>
            </ListItem>
          );
        })}
    </>
  );
};

export { PaymentsBreakdown };

const styles = StyleSheet.create({
  listItem: {
    paddingTop: ITEM_SPACING,
    paddingBottom: ITEM_SPACING,
  },
});

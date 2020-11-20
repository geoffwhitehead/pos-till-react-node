import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { OrganizationContext } from '../../../../contexts/OrganizationContext';
import { Button, Text } from '../../../../core';
import {
  Bill,
  BillDiscount,
  BillItem,
  BillPayment,
  Discount,
  PaymentType,
  PriceGroup,
  Printer,
  tableNames,
} from '../../../../models';
import { print } from '../../../../services/printer/printer';
import { receiptBill } from '../../../../services/printer/receiptBill';
import { fonts } from '../../../../theme';
import { formatNumber } from '../../../../utils';
interface CompleteBillOuterProps {
  bill: Bill;
  onCloseBill: () => void;
  database: Database;
}

interface CompleteBillInnerProps {
  billPayments: BillPayment[];
  billItems: BillItem[];
  billDiscounts: BillDiscount[];
  discounts: Discount[];
  priceGroups: PriceGroup[];
  paymentTypes: PaymentType[];
  printers: Printer[];
}

const CompleteBillInner: React.FC<CompleteBillOuterProps & CompleteBillInnerProps> = ({
  onCloseBill,
  billPayments,
  billItems,
  billDiscounts,
  discounts,
  priceGroups,
  paymentTypes,
  printers,
}) => {
  const { organization } = useContext(OrganizationContext);
  const { currency } = organization;
  const animation = useRef();

  const onPrint = async () => {
    const receiptPrinter = printers.find(p => p.id === organization.receiptPrinterId);

    const commands = await receiptBill(
      billItems,
      billDiscounts,
      billPayments,
      discounts,
      priceGroups,
      paymentTypes,
      receiptPrinter,
      organization,
    );
    await print(commands, receiptPrinter, true);
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        onCloseBill();
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [onCloseBill]),
  );

  useEffect(() => {
    animation.current.play(0, 100);
  }, []);

  const changePayment = billPayments.find(billPayment => billPayment.isChange).amount;

  return (
    <View style={styles.container}>
      <LottieView
        style={{ height: 250, width: 250 }}
        source={require('../../../../animations/4914-cart-checkout-fast.json')}
        autoPlay={false}
        loop={false}
        ref={animation}
      />
      <Text style={styles.text}>{`Change due: ${formatNumber(Math.abs(changePayment), currency)}`}</Text>
      <Button style={styles.button} large onPress={onPrint}>
        <Text>Print Receipt</Text>
      </Button>
      <Button style={styles.button} large bordered success onPress={onCloseBill}>
        <Text>Close</Text>
      </Button>
    </View>
  );
};

const enhance = component =>
  withDatabase(
    withObservables<CompleteBillOuterProps, CompleteBillInnerProps>(['bill'], ({ bill, database }) => ({
      bill,
      billPayments: bill.billPayments,
      billDiscounts: bill.billDiscounts,
      billItems: bill.billItems,
      discounts: database.collections.get<Discount>(tableNames.discounts).query(),
      paymentTypes: database.collections.get<PaymentType>(tableNames.paymentTypes).query(),
      priceGroups: database.collections.get<PriceGroup>(tableNames.priceGroups).query(),
      printers: database.collections.get<Printer>(tableNames.printers).query(),
    }))(component),
  );

export const CompleteBill = enhance(CompleteBillInner);

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center' },
  icon: { width: 50, height: 50 },
  button: { ...fonts.h1, margin: 5 },
  text: { ...fonts.h3, margin: 20 },
});

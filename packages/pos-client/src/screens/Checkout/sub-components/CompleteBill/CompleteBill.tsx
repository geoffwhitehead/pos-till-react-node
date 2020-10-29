import React, { useContext } from 'react';
import { Text, Button } from '../../../../core';
import { formatNumber } from '../../../../utils';
import { StyleSheet, View, BackHandler } from 'react-native';
import { Fonts } from '../../../../theme';
import { print } from '../../../../services/printer/printer';
import { useFocusEffect } from '@react-navigation/native';
import { receiptBill } from '../../../../services/printer/receiptBill';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import {
  tableNames,
  Discount,
  Bill,
  PaymentType,
  PriceGroup,
  Printer,
  BillDiscount,
  BillItem,
  BillPayment,
} from '../../../../models';
import { Database } from '@nozbe/watermelondb';
import { OrganizationContext } from '../../../../contexts/OrganizationContext';

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
    React.useCallback(() => {
      const onBackPress = () => {
        onCloseBill();
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [onCloseBill]),
  );

  const changePayment = billPayments.find(billPayment => billPayment.isChange).amount;

  return (
    <View style={styles.container}>
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
  withDatabase<any>( // TODO: fix
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
  button: { ...Fonts.h1, margin: 5 },
  text: { ...Fonts.h3, margin: 20 },
});

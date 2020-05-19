import React, { useEffect } from 'react';
import { Text, Content, Icon, Button } from '../../../../core';
import { BillProps } from '../../../../services/schemas';
import { balance, formatNumber } from '../../../../utils';
import { StyleSheet, View, BackHandler } from 'react-native';
import { Fonts } from '../../../../theme';
import { print } from '../../../../services/printer/printer';
import { useFocusEffect } from '@react-navigation/native';
import { receiptBill } from '../../../../services/printer/receiptBill';

interface CompleteBillProps {
  currentBill: BillProps;
  onCloseBill: () => void;
}

// TODO : move this
const currencySymbol = '£';

export const CompleteBill: React.FC<CompleteBillProps> = ({ currentBill, onCloseBill }) => {
  const onPrint = async () => await print(receiptBill(currentBill), true);
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        onCloseBill();
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [onCloseBill]),
  );

  const changePayment = currentBill.payments.find(payment => payment.isChange).amount;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{`Change due: ${formatNumber(Math.abs(changePayment), currencySymbol)}`}</Text>
      <Button style={styles.button} large onPress={onPrint}>
        <Text>Print Receipt</Text>
      </Button>
      <Button style={styles.button} large bordered success onPress={onCloseBill}>
        <Text>Close</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center' },
  icon: { width: 50, height: 50 },
  button: { ...Fonts.h1, margin: 5 },
  text: { ...Fonts.h3, margin: 20 },
});

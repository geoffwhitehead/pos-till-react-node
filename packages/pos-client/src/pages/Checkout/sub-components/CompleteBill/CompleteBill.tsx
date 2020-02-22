import React from 'react';
import { Text, Content, Icon, Button } from '../../../../core';
import { BillProps } from '../../../../services/schemas';
import { balance, formatNumber } from '../../../../utils';
import { StyleSheet, View } from 'react-native';
import { Fonts } from '../../../../theme';

interface CompleteBillProps {
  activeBill: BillProps;
  onCloseBill: (bill: any) => void;
}

// TODO : move this
const currencySymbol = '£'

export const CompleteBill: React.FC<CompleteBillProps> = ({ activeBill, onCloseBill }) => {
  const onCloseFactory = (bill: any) => () => onCloseBill(bill);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{`Change due: ${formatNumber(Math.abs(balance(activeBill)), currencySymbol)}`}</Text>
      <Button style={styles.button} large onPress={onCloseFactory(activeBill)}>
        <Text>Print Receipt</Text>
      </Button>
      <Button style={styles.button} large bordered success onPress={onCloseFactory(activeBill)}>
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

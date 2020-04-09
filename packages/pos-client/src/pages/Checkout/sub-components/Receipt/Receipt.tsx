import React from 'react';
import { Text, Col, Grid, Row, Button } from '../../../../core';
import { StyleSheet } from 'react-native';
import { balance, total, totalDiscount, formatNumber } from '../../../../utils';
import { Fonts } from '../../../../theme';
import { ReceiptItems } from './ReceiptItems';
import dayjs from 'dayjs';
import { print } from '../../../../services/printer/printer';
import { receiptBill } from '../../../../services/printer/receiptBill';

import { Results } from 'realm';
import { BillProps } from '../../../../services/schemas';

// TODO: move into org and fetch from db or something
const currencySymbol = '£';

interface ReceiptProps {
  activeBill: BillProps; // TODO
  onStore?: () => void;
  onCheckout?: () => void;
  complete: boolean;
}

export const Receipt: React.FC<ReceiptProps> = ({ activeBill, onStore, onCheckout, complete }) => {
  const onPrint = () => {
    const commands = receiptBill(activeBill);
    print(commands, false);
  };

  return !activeBill ? (
    <Text>Select bill</Text>
  ) : (
    <Grid style={styles.grid}>
      <Row style={styles.r1}>
        <Col>
          <Button style={styles.buttons} light onPress={onStore}>
            <Text>Bill / Table: {(activeBill && activeBill.tab) || '-'}</Text>
          </Button>
        </Col>
        <Col>
          <Text style={styles.dateText}>
            {dayjs(activeBill.timestamp)
              .format('DD/MM/YYYY HH:mm')
              .toString()}
          </Text>
        </Col>
      </Row>

      <Row>
        <ReceiptItems readonly={complete} activeBill={activeBill} />
      </Row>
      <Row style={styles.r3}>
        <Text>
          {activeBill.discounts.length ? `Discount: ${formatNumber(totalDiscount(activeBill), currencySymbol)}` : ''}
        </Text>
        <Text>{`Total: ${formatNumber(total(activeBill), currencySymbol)}`}</Text>
        {complete && (
          <Text>{`Change Due: ${formatNumber(
            Math.abs(activeBill.payments.find(payment => payment.isChange).amount),
            currencySymbol,
          )}`}</Text>
        )}
        <Text style={Fonts.h3}>{`Balance: ${formatNumber(balance(activeBill), currencySymbol)}`}</Text>
      </Row>
      <Row style={styles.r4}>
        <Button style={styles.printButton} block small info onPress={onPrint}>
          <Text>Print</Text>
        </Button>
      </Row>
      {!complete && (
        <Row style={styles.r5}>
          <Col>
            <Button style={styles.buttons} block small onPress={onStore}>
              <Text>Store</Text>
            </Button>
          </Col>
          <Col>
            <Button style={styles.buttons} block small success onPress={onCheckout}>
              <Text>Checkout</Text>
            </Button>
          </Col>
        </Row>
      )}
    </Grid>
  );
};

const styles = StyleSheet.create({
  grid: {
    borderLeftWidth: 1,
    borderLeftColor: 'lightgrey',
  },
  r1: {
    height: 45,
  },
  r3: {
    borderTopColor: 'lightgrey',
    borderTopWidth: 1,
    height: 100,
    flexDirection: 'column',
    padding: 10,
  },
  r4: {
    height: 50,
  },
  r5: { height: 50 },
  buttons: {
    height: '100%',
  },
  printButton: {
    height: '100%',
    width: '100%',
    textAlign: 'center',
  },
  dateText: {
    textAlign: 'center',
    lineHeight: 45,
    backgroundColor: 'whitesmoke',
  },
});

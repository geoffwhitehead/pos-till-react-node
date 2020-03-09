import React from 'react';
import { Text, Col, Grid, Row, Button } from '../../../../core';
import { StyleSheet } from 'react-native';
import { balance, total, totalDiscount, formatNumber } from '../../../../utils';
import { Fonts } from '../../../../theme';
import { ReceiptItems } from './ReceiptItems';

// TODO: move into org and fetch from db or something
const currencySymbol = '£';

interface ReceiptProps {
  activeBill: any; // TODO
  onStore: () => void;
  onCheckout: () => void;
  complete: boolean;
}

export const Receipt: React.FC<ReceiptProps> = ({ activeBill, onStore, onCheckout, complete }) => {
  return !activeBill ? (
    <Text>Select bill</Text>
  ) : (
    <Grid style={styles.grid}>
      <Row style={{ height: 45 }}>
        <Col>
          <Button style={styles.buttons} light onPress={onStore}>
            <Text>Bill / Table: {(activeBill && activeBill.tab) || '-'}</Text>
          </Button>
        </Col>
        <Col>
          <Text>Something</Text>
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
        <Text style={Fonts.h3}>{`Balance: ${formatNumber(balance(activeBill), currencySymbol)}`}</Text>
      </Row>
      {!complete && (
        <Row style={styles.r4}>
          <Col>
            <Button style={styles.buttons} small onPress={onStore}>
              <Text>Store</Text>
            </Button>
          </Col>
          <Col>
            <Button style={styles.buttons} small success onPress={onCheckout}>
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
  r3: {
    borderTopColor: 'lightgrey',
    borderTopWidth: 1,
    height: 100,
    flexDirection: 'column',
    padding: 10,
  },
  r4: { height: 50 },
  buttons: {
    height: '100%',
  },
});

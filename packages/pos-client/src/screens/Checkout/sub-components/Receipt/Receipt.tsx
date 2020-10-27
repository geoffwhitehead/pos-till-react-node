import React, { useState, useEffect, useContext } from 'react';
import { Text, Col, Grid, Row, Button } from '../../../../core';
import { StyleSheet } from 'react-native';
import { formatNumber, billSummary, BillSummary } from '../../../../utils';
import { Fonts } from '../../../../theme';
import { ReceiptItems } from './ReceiptItems';
import dayjs from 'dayjs';
import { print } from '../../../../services/printer/printer';
import { receiptBill } from '../../../../services/printer/receiptBill';
import withObservables from '@nozbe/with-observables';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { tableNames, Discount, PaymentType, PriceGroup, Bill, Printer } from '../../../../models';
import { Database } from '@nozbe/watermelondb';
import { BillItem } from '../../../../models/BillItem';
import { kitchenReceipt } from '../../../../services/printer/kitchenReceipt';
import { flatten, groupBy } from 'lodash';
import { Loading } from '../../../../components/Loading/Loading';
import { OrganizationContext } from '../../../../contexts/OrganizationContext';

// TODO: type these
interface ReceiptInnerProps {
  billPayments: any[];
  billDiscounts: any[];
  billItems: any[];
  billItemsNoComp: any[];
  billItemsIncPendingVoids: any[];
  discounts: any[];
  paymentTypes: any[];
  priceGroups: any[];
  billModifierItems: any[];
  printers: any[];
  database: Database;
}

interface ReceiptOuterProps {
  onStore?: () => void;
  onCheckout?: () => void;
  bill: Bill;
  database: Database;
  complete: boolean;
}

export const ReceiptInner: React.FC<ReceiptOuterProps & ReceiptInnerProps> = ({
  bill,
  billItems,
  billItemsNoComp,
  billItemsIncPendingVoids,
  billDiscounts,
  billPayments,
  onStore,
  onCheckout,
  complete,
  discounts,
  paymentTypes,
  priceGroups,
  billModifierItems,
  printers,
  database,
}) => {
  const [summary, setSummary] = useState<BillSummary>();
  const [isStoreDisabled, setIsStoreDisabled] = useState(false);

  const { organization } = useContext(OrganizationContext);
  const { currency } = organization;

  const receiptPrinter =
    organization && printers ? printers.find(p => p.id === organization.receiptPrinterId) : undefined;

  const _onStore = async () => {
    // setIsStoreDisabled(true);
    onStore();
    const billItemsToPrint = billItemsIncPendingVoids.filter(
      ({ printStatus }) => !(printStatus === 'success' || printStatus === 'pending' || printStatus === 'void_pending'),
    ) as BillItem[];

    if (billItemsToPrint.length) {
      await database.action(
        async () =>
          await database.batch(
            ...billItemsToPrint.map(bI =>
              bI.prepareUpdate(billItem => {
                billItem.printStatus = billItem.isVoided ? 'void_pending' : 'pending';
              }),
            ),
          ),
      );

      const toPrint = await kitchenReceipt({
        billItems: billItemsToPrint,
        printers,
        priceGroups,
        reference: bill.reference.toString(),
        prepTime: dayjs().add(10, 'minute'),
      });

      const printStatuses = await Promise.all(
        toPrint.map(async ({ billItems, printer, commands }) => {
          const res = await print(commands, printer, false);
          return billItems.map(billItem => {
            return {
              billItem,
              success: res.success,
            };
          });
        }),
      );

      /**
       * a single bill item can be sent to mulitple printers. If any print fails, the status
       * will be set to failed.
       */

      // group all the print responses by bill item
      const responses = groupBy(flatten(printStatuses), status => status.billItem.id);

      // resolve the print status for each item by checking for existence of failed print
      const reducedResponses = Object.keys(responses).map(key => {
        const response = responses[key];
        return {
          billItem: responses[key][0].billItem,
          success: !response.some(({ success }) => !success),
        };
      });

      const updates = reducedResponses.map(({ billItem, success }) => {
        let printStatus = 'success';

        if (!success) {
          printStatus = billItem.isVoided ? 'void_error' : 'error';
        }

        return billItem.prepareUpdate(billItemRecord => {
          Object.assign(billItemRecord, { printStatus });
        });
      });

      await database.action(async () => {
        await database.batch(...flatten(updates));
      });
    }
    // setIsStoreDisabled(false);
  };

  useEffect(() => {
    const summary = async () => {
      const summary = await billSummary(billItemsNoComp, billDiscounts, billPayments, discounts);
      setSummary(summary);
    };
    summary();
  }, [billItemsNoComp, billDiscounts, billPayments, billModifierItems]); // keep billModifierItems

  const onPrint = async () => {
    console.log('printers', printers);
    console.log('receiptPrinter', receiptPrinter);
    console.log('onPrint');
    console.log('billItems', billItems);
    const commands = await receiptBill(
      billItems,
      billDiscounts,
      billPayments,
      discounts,
      priceGroups,
      paymentTypes,
      receiptPrinter,
      currency,
    );
    console.log('commands', commands);

    print(commands, receiptPrinter, false);
  };

  if (!bill || !summary) {
    return <Loading />;
  }

  const { totalDiscount, totalPayable, balance } = summary;

  return (
    <Grid style={styles.grid}>
      <Row style={styles.r1}>
        <Col>
          <Button style={styles.buttons} light onPress={onStore}>
            <Text>Bill / Table: {bill.reference || '-'}</Text>
          </Button>
        </Col>
        <Col>
          <Text style={styles.dateText}>
            {dayjs(bill.createdAt)
              .format('DD/MM/YYYY HH:mm')
              .toString()}
          </Text>
        </Col>
      </Row>

      <Row>
        <ReceiptItems
          readonly={complete}
          billItems={billItemsIncPendingVoids}
          discountBreakdown={summary.discountBreakdown}
          billPayments={billPayments}
          billDiscounts={billDiscounts}
          paymentTypes={paymentTypes}
        />
      </Row>
      <Row style={styles.r3}>
        {<Text>{`Discount: ${formatNumber(totalDiscount, currency)}`}</Text>}

        <Text>{`Total: ${formatNumber(totalPayable, currency)}`}</Text>
        {complete && (
          <Text>{`Change Due: ${formatNumber(
            Math.abs(billPayments.find(payment => payment.isChange).amount),
            currency,
          )}`}</Text>
        )}
        <Text style={Fonts.h3}>{`Balance: ${formatNumber(balance, currency)}`}</Text>
      </Row>
      <Row style={styles.r4}>
        <Button disabled={!receiptPrinter} style={styles.printButton} block small onPress={onPrint}>
          <Text>Print</Text>
        </Button>
      </Row>
      {!complete && (
        <Row style={styles.r5}>
          <Col>
            <Button style={styles.buttons} block small disabled={isStoreDisabled} onPress={_onStore}>
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

const enhance = component =>
  withDatabase<any>( // TODO: type
    withObservables<ReceiptOuterProps, ReceiptInnerProps>(['bill'], ({ bill, database }) => ({
      bill,
      billPayments: bill.billPayments,
      billDiscounts: bill.billDiscounts,
      billItems: bill.billItems,
      billItemsNoComp: bill.billItemsNoComp,
      billItemsIncPendingVoids: bill.billItemsIncPendingVoids,
      discounts: database.collections.get<Discount>(tableNames.discounts).query(),
      paymentTypes: database.collections.get<PaymentType>(tableNames.paymentTypes).query(),
      priceGroups: database.collections.get<PriceGroup>(tableNames.priceGroups).query(),
      printers: database.collections.get<Printer>(tableNames.printers).query(),
      /**
       * billModifierItems is here purely to cause a re render and recalculation of the
       * bill summary
       */
      billModifierItems: bill.billModifierItems,
    }))(component),
  );

export const Receipt = enhance(ReceiptInner);

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
    height: 110,
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

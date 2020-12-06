import { useDatabase } from '@nozbe/watermelondb/hooks';
import withObservables from '@nozbe/with-observables';
import { capitalize, sumBy } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Loading } from '../../../../components/Loading/Loading';
import { OrganizationContext } from '../../../../contexts/OrganizationContext';
import { Col, Content, Left, List, ListItem, Right, Row, Separator, Text } from '../../../../core';
import { BillPeriod } from '../../../../models';
import { PeriodReportData, periodReportData } from '../../../../services/printer/periodReport';
import { formatNumber } from '../../../../utils';
import { RECEIPT_PANEL_BUTTONS_WIDTH, RECEIPT_PANEL_WIDTH } from '../../../../utils/consts';
import { moderateScale } from '../../../../utils/scaling';
interface ReportReceiptInnerProps {
  // onPressPrint: () => void;
  closedBillsCount: number;
}

interface ReportReceiptOuterProps {
  // onPressPrint: () => void;
  billPeriod: BillPeriod;
}

export const ReportReceiptInner: React.FC<ReportReceiptInnerProps & ReportReceiptOuterProps> = ({
  // onPressPrint,
  billPeriod,
  closedBillsCount,
}) => {
  const {
    organization: { currency },
  } = useContext(OrganizationContext);

  const database = useDatabase();

  const [reportData, setReportData] = useState<PeriodReportData>();

  useEffect(() => {
    const fetchData = async () => {
      console.log('---recalc');
      const summary = await periodReportData({ billPeriod, database });
      setReportData(summary);
    };
    fetchData();
  }, [billPeriod, closedBillsCount]);

  if (!reportData) {
    return <Loading />;
  }

  const {
    bills,
    billItems,
    categories,
    categoryTotals,
    modifierTotals,
    discountTotals,
    paymentTotals,
    voidTotal,
    voidCount,
    priceGroupTotals,
    salesTotal,
    compBillItems,
    compBillItemModifierItems,
  } = reportData;

  console.log('closedBillsCount', closedBillsCount);
  return (
    <Col style={styles.rightColumn}>
      <Row>
        <Content>
          <List>
            <Separator bordered>
              <Text>Category Totals</Text>
            </Separator>
            {categoryTotals.breakdown.map(({ categoryId, count, total }) => {
              const category = categories.find(c => c.id === categoryId);
              if (!category) {
                return null;
              }
              return (
                <ListItem key={categoryId}>
                  <Left>
                    <Text>{category.name}</Text>
                  </Left>
                  <Right style={styles.listItemRight}>
                    <Text>{`${count} / ${formatNumber(total, currency)}`}</Text>
                  </Right>
                </ListItem>
              );
            })}
            <ListItem>
              <Left>
                <Text>Total</Text>
              </Left>
              <Right style={styles.listItemRight}>
                <Text>{`${categoryTotals.count} / ${formatNumber(categoryTotals.total, currency)}`}</Text>
              </Right>
            </ListItem>
            <Separator bordered>
              <Text>Modifier Totals</Text>
            </Separator>
            {modifierTotals.breakdown.map(({ modifierName, breakdown, total, count }) => {
              return (
                <>
                  <ListItem itemDivider key={modifierName}>
                    <Left>
                      <Text>{modifierName}</Text>
                    </Left>
                    <Right style={styles.listItemRight}>
                      <Text>{`${count} / ${formatNumber(total, currency)}`}</Text>
                    </Right>
                    <Text></Text>
                  </ListItem>
                  {breakdown.map(({ modifierItemName, total, count }) => {
                    return (
                      <ListItem key={modifierName + modifierItemName}>
                        <Left>
                          <Text>{modifierItemName}</Text>
                        </Left>
                        <Right style={styles.listItemRight}>
                          <Text>{`${count} / ${formatNumber(total, currency)}`}</Text>
                        </Right>
                      </ListItem>
                    );
                  })}
                </>
              );
            })}
            <ListItem>
              <Left>
                <Text>Total</Text>
              </Left>
              <Right style={styles.listItemRight}>
                <Text>{`${modifierTotals.count} / ${formatNumber(modifierTotals.total, currency)}`}</Text>
              </Right>
            </ListItem>
            <Separator bordered>
              <Text>Price Group Totals (excl discounts)</Text>
            </Separator>
            {priceGroupTotals.map(({ name, total, count }) => {
              return (
                <ListItem key={name}>
                  <Left>
                    <Text>{name}</Text>
                  </Left>
                  <Right style={styles.listItemRight}>
                    <Text>{`${count} / ${formatNumber(total, currency)}`}</Text>
                  </Right>
                </ListItem>
              );
            })}
            <ListItem>
              <Left>
                <Text>Total</Text>
              </Left>
              <Right style={styles.listItemRight}>
                <Text>{`${sumBy(priceGroupTotals, ({ count }) => count)} / ${formatNumber(
                  sumBy(priceGroupTotals, ({ total }) => total),
                  currency,
                )}`}</Text>
              </Right>
            </ListItem>
            <Separator bordered>
              <Text>Discount Totals</Text>
            </Separator>
            {discountTotals.breakdown.map(({ name, total, count }) => {
              return (
                <ListItem>
                  <Left>
                    <Text>{name}</Text>
                  </Left>
                  <Right style={styles.listItemRight}>
                    <Text>{`${count} / ${formatNumber(total, currency)}`}</Text>
                  </Right>
                </ListItem>
              );
            })}
            <Separator bordered>
              <Text>Complimentary Totals</Text>
            </Separator>
            <ListItem>
              <Left>
                <Text>Items</Text>
              </Left>
              <Right style={styles.listItemRight}>
                <Text>{`${compBillItems.length} / ${formatNumber(sumBy(compBillItems, 'itemPrice'), currency)}`}</Text>
              </Right>
            </ListItem>
            <ListItem>
              <Left>
                <Text>Modifiers</Text>
              </Left>
              <Right style={styles.listItemRight}>
                <Text>{`${compBillItemModifierItems.length} / ${formatNumber(
                  sumBy(compBillItemModifierItems, 'modifierItemPrice'),
                  currency,
                )}`}</Text>
              </Right>
            </ListItem>

            <Separator bordered>
              <Text>Payment Totals</Text>
            </Separator>
            {paymentTotals.breakdown.map(({ name, total, count }) => {
              return (
                <ListItem>
                  <Left>
                    <Text>{capitalize(name)}</Text>
                  </Left>
                  <Right style={styles.listItemRight}>
                    <Text>{`${count} / ${formatNumber(total, currency)}`}</Text>
                  </Right>
                </ListItem>
              );
            })}
            <ListItem>
              <Left>
                <Text>Total</Text>
              </Left>
              <Right style={styles.listItemRight}>
                <Text>{`${paymentTotals.count} / ${formatNumber(paymentTotals.total, currency)}`}</Text>
              </Right>
            </ListItem>

            {/* BILLS */}
            <Separator bordered>
              <Text>Total</Text>
            </Separator>
            <ListItem>
              <Left>
                <Text>Number of bills</Text>
              </Left>
              <Right style={styles.listItemRight}>
                <Text>{bills.length.toString()}</Text>
              </Right>
            </ListItem>
            <ListItem>
              <Left>
                <Text>Voids</Text>
              </Left>
              <Right style={styles.listItemRight}>
                <Text>{`${voidCount} / ${formatNumber(voidTotal, currency)}`}</Text>
              </Right>
            </ListItem>
            <ListItem>
              <Left>
                <Text>Discounts: </Text>
              </Left>
              <Right style={styles.listItemRight}>
                <Text>{`${discountTotals.count} / ${formatNumber(discountTotals.total, currency)}`}</Text>
              </Right>
            </ListItem>
            <ListItem>
              <Left>
                <Text>Sales Total: </Text>
              </Left>
              <Right style={styles.listItemRight}>
                <Text>{formatNumber(salesTotal, currency)}</Text>
              </Right>
            </ListItem>
          </List>
        </Content>
      </Row>
    </Col>
  );
};

const enhance = c =>
  withObservables<ReportReceiptOuterProps, ReportReceiptInnerProps>(['billPeriod'], ({ billPeriod }) => ({
    closedBillsCount: billPeriod.bills.observeCount(),
  }))(c);

export const ReportReceipt = enhance(ReportReceiptInner);

const styles = StyleSheet.create({
  rightColumn: {
    width: moderateScale(RECEIPT_PANEL_WIDTH + RECEIPT_PANEL_BUTTONS_WIDTH),
    borderLeftWidth: 1,
    borderLeftColor: 'lightgrey',
  },
  listItemRight: {
    flex: 1,
  },
  rowPrintButton: { height: 10, padding: 5 },
  printButton: { width: '100%', textAlign: 'center', height: '100%' },
});

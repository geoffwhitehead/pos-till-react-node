import React from 'react';
import { StyleSheet } from 'react-native';
import { moderateScale } from '../../../../utils/scaling';

const sumObject: (obj: Record<string, number>) => number = obj =>
  Object.keys(obj).reduce((acc, id) => acc + obj[id], 0);

interface ReportReceiptProps {
  onPressPrint: () => void;
  categories: any;
  discounts: any;
  paymentTypes: any;
  billPeriod: any;
  bills: any;
}

export const ReportReceipt: React.FC<ReportReceiptProps> = ({
  onPressPrint,
  billPeriod,
  bills,
  categories,
  discounts,
  paymentTypes,
}) => {
  // const categoryTotals = billItemsCategoryTotals(bills, categories);
  // const paymentTotals = totalBillsPaymentBreakdown(bills, paymentTypes);
  // const discountTotals = discountBreakdownTotals(bills, discounts);
  // const categoryTotals = useMemo(() => billItemsCategoryTotals(bills, categories), [bills, categories]);
  // const paymentTotals = useMemo(() => totalBillsPaymentBreakdown(bills, paymentTypes), [bills, paymentTypes]);
  // const discountTotals = useMemo(() => discountBreakdownTotals(bills, discounts), [bills, discounts]);
  // const grossSalesTotal = sumObject(categoryTotals);
  // const discountTotal = sumObject(discountTotals);
  // const netSalesTotal = grossSalesTotal - discountTotal;
  // const resolveName: (id: string, collection: Collection<{ _id: string; name: string }>) => string = (id, collection) =>
  //   collection.find(({ _id }) => _id === id).name;
  // const mapGroup: (
  //   group: Record<string, number>,
  //   nameResolver: (id: string) => string,
  //   symbol: string,
  // ) => React.ReactNode[] = (group, nameResolver, symbol) =>
  //   Object.keys(group).map(id => {
  //     return (
  //       <ListItem>
  //         <Left>
  //           <Text>{capitalize(nameResolver(id))}</Text>
  //         </Left>
  //         <Right>
  //           <Text>{formatNumber(group[id], symbol)}</Text>
  //         </Right>
  //       </ListItem>
  //     );
  //   });
  // return (
  //   billPeriod && (
  //     <Col style={styles.rightColumn}>
  //       <Row>
  //         <Content>
  //           <List>
  //             <Separator bordered>
  //               <Text>Sales</Text>
  //             </Separator>
  //             <ListItem>
  //               <Left>
  //                 <Text>Total</Text>
  //               </Left>
  //               <Right>
  //                 <Text>{bills.length.toString()}</Text>
  //               </Right>
  //             </ListItem>
  //             <Separator bordered>
  //               <Text>Category Totals</Text>
  //             </Separator>
  //             {/* {mapGroup(categoryTotals, id => resolveName(id, categories), currencySymbol)} */}
  //             <Separator bordered>
  //               <Text>Payment Totals</Text>
  //             </Separator>
  //             {/* {mapGroup(paymentTotals, id => resolveName(id, paymentTypes), currencySymbol)} */}
  //             <Separator bordered>
  //               <Text>Discount Totals</Text>
  //             </Separator>
  //             {/* {mapGroup(discountTotals, id => resolveName(id, discounts), currencySymbol)} */}
  //             <Separator bordered>
  //               <Text>Totals</Text>
  //             </Separator>
  //             <ListItem>
  //               <Left>
  //                 <Text>Gross Sales Total: </Text>
  //               </Left>
  //               <Right>
  //                 {/* <Text>{formatNumber(grossSalesTotal, currencySymbol)}</Text> */}
  //               </Right>
  //             </ListItem>
  //             <ListItem>
  //               <Left>
  //                 <Text>Discount Total: </Text>
  //               </Left>
  //               <Right>
  //                 {/* <Text>{formatNumber(discountTotal, currencySymbol)}</Text> */}
  //               </Right>
  //             </ListItem>
  //             <ListItem>
  //               <Left>
  //                 <Text>Net Sales Total: </Text>
  //               </Left>
  //               <Right>
  //                 {/* <Text>{formatNumber(netSalesTotal, currencySymbol)}</Text> */}
  //               </Right>
  //             </ListItem>
  //             <ListItem>
  //               <Left>
  //                 <Text>Grand Total: </Text>
  //               </Left>
  //               <Right>
  //                 {/* <Text>{formatNumber(sumObject(paymentTotals), currencySymbol)}</Text> */}
  //               </Right>
  //             </ListItem>
  //           </List>
  //         </Content>
  //       </Row>
  //       <Row style={styles.rowPrintButton}>
  //         <Button style={styles.printButton} block info onPress={onPressPrint}>
  //           <Text>{billPeriod.closed ? 'Print Z Report' : 'Print X Report'}</Text>
  //         </Button>
  //       </Row>
  //     </Col>
  //   )
  // );
};

const styles = StyleSheet.create({
  rightColumn: { width: moderateScale(350), borderLeftWidth: 1, borderLeftColor: 'lightgrey' },
  rowPrintButton: { height: 10, padding: 5 },
  printButton: { width: '100%', textAlign: 'center', height: '100%' },
});

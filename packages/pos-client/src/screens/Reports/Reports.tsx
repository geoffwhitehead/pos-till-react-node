import { Database, Q } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import dayjs from 'dayjs';
import React, { useContext, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
import { OrganizationContext } from '../../contexts/OrganizationContext';
import { ReceiptPrinterContext } from '../../contexts/ReceiptPrinterContext';
import { ActionSheet, Button, Col, Container, Grid, Left, List, ListItem, Right, Text, Toast, View } from '../../core';
import { BillPeriod, Organization, PaymentType, Printer, tableNames } from '../../models';
import { SidebarDrawerStackParamList } from '../../navigators/SidebarNavigator';
import { correctionReport } from '../../services/printer/correctionReport';
// import { Protected } from './Protected';
import { periodReport } from '../../services/printer/periodReport';
// import { ReportsList } from './sub-components/ReportsList/ReportsList';
// import { ReportReceipt } from './sub-components/ReportReceipt/ReportReceipt';
import { print } from '../../services/printer/printer';
import { resolveButtonState } from '../../utils/helpers';

// const ORG_PASSCODE = '1234'; // TODO: move to an org setting and hash
interface ReportsInnerProps {
  billPeriods: BillPeriod[];
  paymentTypes: PaymentType[];
}

interface ReportsOuterProps {
  navigation: DrawerNavigationProp<SidebarDrawerStackParamList, 'Reports'>;
  database: Database;
}

export const ReportsInner: React.FC<ReportsOuterProps & ReportsInnerProps> = ({
  database,
  navigation,
  billPeriods,
}) => {
  const { organization } = useContext(OrganizationContext);
  const { receiptPrinter } = useContext(ReceiptPrinterContext);
  const [isLoading, setIsLoading] = useState(false);

  const openDrawer = () => navigation.openDrawer();

  const onPrintPeriodReport = async (billPeriod: BillPeriod) => {
    setIsLoading(true);
    const commands = await periodReport({ billPeriod, database, printer: receiptPrinter, organization });
    await print(commands, receiptPrinter);
    setIsLoading(false);
  };

  const closePeriod = async (billPeriod: BillPeriod, organization: Organization) => {
    setIsLoading(true);
    await database.action(() => billPeriod.closePeriod(organization));
    await onPrintPeriodReport(billPeriod);
    setIsLoading(false);
  };

  const onPrintCorrectionReport = async (billPeriod: BillPeriod) => {
    setIsLoading(true);
    const commands = await correctionReport({ billPeriod, database, printer: receiptPrinter, organization });
    await print(commands, receiptPrinter);
    setIsLoading(false);
  };

  const confirmClosePeriod = async (billPeriod: BillPeriod, organization: Organization) => {
    const openBills = await billPeriod.openBills.fetch();
    console.log('openBills', openBills);
    if (openBills.length > 0) {
      Toast.show({
        text: `There are currently ${openBills.length} open bills, please close these first.`,
        buttonText: 'Okay',
        duration: 5000,
      });
    } else {
      const options = ['Close bill period', 'Cancel'];
      ActionSheet.show(
        {
          options,
          title: 'Close current billing period and print report?',
        },
        async index => {
          index === 0 && (await closePeriod(billPeriod, organization));
        },
      );
    }
  };

  return (
    <Container>
      <SidebarHeader title="Reports" onOpen={openDrawer} />
      {/* <Protected code={ORG_PASSCODE} navigation={navigation}> */}
      <Grid>
        <Col>
          <ListItem itemHeader first>
            <Text style={{ fontWeight: 'bold' }}>Recent bill periods</Text>
          </ListItem>
          <ScrollView>
            <List>
              {billPeriods.map(billPeriod => {
                return (
                  <ListItem key={billPeriod.id}>
                    <Left>
                      <View style={{ display: 'flex' }}>
                        <Text>{`Opened: ${dayjs(billPeriod.createdAt).format('ddd DD/MM/YYYY HH:mm:ss')}`}</Text>
                        <Text>
                          {`Closed: ${
                            billPeriod.closedAt ? dayjs(billPeriod.closedAt).format('ddd DD/MM/YYYY HH:mm:ss') : ''
                          }`}
                        </Text>
                      </View>
                    </Left>
                    <Right>
                      {!billPeriod.closedAt && (
                        <View>
                          <Button
                            small
                            {...resolveButtonState(isLoading, 'info')}
                            style={{ marginBottom: 2 }}
                            onPress={() => onPrintPeriodReport(billPeriod)}
                          >
                            <Text>Print Status Report</Text>
                          </Button>
                          <Button
                            small
                            {...resolveButtonState(isLoading, 'danger')}
                            onPress={() => confirmClosePeriod(billPeriod, organization)}
                          >
                            <Text>Close Period</Text>
                          </Button>
                        </View>
                      )}
                      {billPeriod.closedAt && (
                        <View>
                          <Button
                            small
                            {...resolveButtonState(isLoading, 'primary')}
                            onPress={() => onPrintPeriodReport(billPeriod)}
                            style={{ marginBottom: 2 }}
                          >
                            <Text>Print End Period Report</Text>
                          </Button>
                          <Button
                            small
                            {...resolveButtonState(isLoading, 'info')}
                            style={{ marginRight: 2 }}
                            onPress={() => onPrintCorrectionReport(billPeriod)}
                          >
                            <Text>Print Correction Report</Text>
                          </Button>
                        </View>
                      )}
                    </Right>
                  </ListItem>
                );
              })}
            </List>
          </ScrollView>
        </Col>
        {/* {selectedBillPeriod && (
          <ReportReceipt
            billPeriod={selectedBillPeriod}
            bills={allBills.filtered('billPeriod._id = $0', selectedBillPeriod._id)}
            categories={categories}
            paymentTypes={paymentTypes}
            discounts={discounts}
            onPressPrint={() => onPrint(selectedBillPeriod)}
          />
        )} */}
      </Grid>
      {/* </Protected> */}
    </Container>
  );
};

const enhance = c =>
  withDatabase<any>(
    withObservables<ReportsOuterProps, ReportsInnerProps>([], ({ database }) => ({
      paymentTypes: database.collections.get<PaymentType>(tableNames.paymentTypes).query(),
      billPeriods: database.collections
        .get<Printer>(tableNames.billPeriods)
        .query(Q.experimentalSortBy('created_at', Q.desc), Q.experimentalTake(4)),
    }))(c),
  );

export const Reports = enhance(ReportsInner);

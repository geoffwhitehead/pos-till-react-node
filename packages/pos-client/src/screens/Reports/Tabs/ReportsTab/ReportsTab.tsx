import { Database, Q } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import dayjs from 'dayjs';
import React, { useContext, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { OrganizationContext } from '../../../../contexts/OrganizationContext';
import { ReceiptPrinterContext } from '../../../../contexts/ReceiptPrinterContext';
import {
  ActionSheet,
  Button,
  Col,
  Container,
  Grid,
  Left,
  List,
  ListItem,
  Right,
  Spinner,
  Text,
  Toast,
  View,
} from '../../../../core';
import { BillPeriod, Organization, PaymentType, Printer, tableNames } from '../../../../models';
import { SidebarDrawerStackParamList } from '../../../../navigators/SidebarNavigator';
import { correctionReport } from '../../../../services/printer/correctionReport';
import { periodReport } from '../../../../services/printer/periodReport';
import { print } from '../../../../services/printer/printer';
import { resolveButtonState } from '../../../../utils/helpers';
import { ReportReceipt } from './ReportReceipt/ReportReceipt';

interface ReportsTabInnerProps {
  billPeriods: BillPeriod[];
  paymentTypes: PaymentType[];
}

interface ReportsTabOuterProps {
  navigation: DrawerNavigationProp<SidebarDrawerStackParamList, 'Reports'>;
  database: Database;
}

export const ReportsTabInner: React.FC<ReportsTabOuterProps & ReportsTabInnerProps> = ({
  database,
  navigation,
  billPeriods,
}) => {
  const { organization } = useContext(OrganizationContext);
  const { receiptPrinter } = useContext(ReceiptPrinterContext);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBillPeriod, setSelectedBillPeriod] = useState<BillPeriod>();

  navigation.addListener('focus', () => setSelectedBillPeriod(null));

  const onPrintPeriodReport = async (billPeriod: BillPeriod) => {
    setIsLoading(true);
    const commands = await periodReport({ billPeriod, database, printer: receiptPrinter, organization });
    await print({ commands, printer: receiptPrinter });
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
    await print({ commands, printer: receiptPrinter });
    setIsLoading(false);
  };

  const confirmClosePeriod = async (billPeriod: BillPeriod, organization: Organization) => {
    const openBills = await billPeriod.openBills.fetch();
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
      <Grid>
        <Col>
          <ListItem itemHeader first>
            <Text style={{ fontWeight: 'bold' }}>Recent bill periods</Text>
          </ListItem>
          <ScrollView>
            <List>
              {billPeriods.map(billPeriod => {
                return (
                  <ListItem key={billPeriod.id} onPress={() => setSelectedBillPeriod(billPeriod)}>
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
            {isLoading && <Spinner />}
          </ScrollView>
        </Col>
        {selectedBillPeriod && (
          <ReportReceipt
            billPeriod={selectedBillPeriod}
            // bills={allBills.filtered('billPeriod._id = $0', selectedBillPeriod._id)}
            // categories={categories}
            // paymentTypes={paymentTypes}
            // discounts={discounts}
            // onPressPrint={() => onPrintPeriodReport(selectedBillPeriod)}
          />
        )}
      </Grid>
    </Container>
  );
};

const enhance = c =>
  withDatabase<any>(
    withObservables<ReportsTabOuterProps, ReportsTabInnerProps>([], ({ database }) => ({
      paymentTypes: database.collections.get<PaymentType>(tableNames.paymentTypes).query(),
      billPeriods: database.collections
        .get<Printer>(tableNames.billPeriods)
        .query(Q.experimentalSortBy('created_at', Q.desc), Q.experimentalTake(7)),
    }))(c),
  );

export const ReportsTab = enhance(ReportsTabInner);

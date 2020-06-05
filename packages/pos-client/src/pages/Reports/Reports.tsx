import React, { useContext, useState } from 'react';
import { Toast, Container, Grid, Col, Text, ActionSheet, Button, Content } from '../../core';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
import {
  BillPeriodSchema,
  BillProps,
  BillSchema,
  BillPeriodProps,
  CategoryProps,
  CategorySchema,
  DiscountProps,
  DiscountSchema,
  PaymentTypeProps,
  PaymentTypeSchema,
} from '../../services/schemas';
import { BillPeriodContext } from '../../contexts/BillPeriodContext';
import { realm } from '../../services/Realm';
import { Protected } from './Protected';
import { useRealmQuery } from 'react-use-realm';
import { periodReport, _periodReport } from '../../services/printer/periodReport';
import { ReportsList } from './sub-components/ReportsList/ReportsList';
import { ReportReceipt } from './sub-components/ReportReceipt/ReportReceipt';
import { print } from '../../services/printer/printer';
import uuidv4 from 'uuid';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { withBillPeriod } from '../../hocs/withBillPeriod';
import { database } from '../../App';
import { tNames } from '../../models';
import { Q, tableName } from '@nozbe/watermelondb';
import dayjs from 'dayjs';
import { View } from 'react-native';
import { formatNumber, paymentSummary } from '../../utils';
import { capitalize } from 'lodash';

const ORG_PASSCODE = '1234'; // TODO: move to an org setting and hash
const symbol = '£'; // TODO move

export const ReportsInner = ({ database, navigation, billPeriod, categories, periodPayments, openBills, paymentTypes }) => {
  const openDrawer = () => navigation.openDrawer();
  // const billPeriods = useRealmQuery<BillPeriodProps>({
  //   source: BillPeriodSchema.name,
  //   sort: [['opened', true]],
  // });

  // const categories = useRealmQuery<CategoryProps>({ source: CategorySchema.name });
  // const discounts = useRealmQuery<DiscountProps>({ source: DiscountSchema.name });
  // const paymentTypes = useRealmQuery<PaymentTypeProps>({ source: PaymentTypeSchema.name });
  // const allBills = useRealmQuery<BillProps>({
  //   source: BillSchema.name,
  // });

  // const [selectedBillPeriod, setSelectedBillPeriod] = useState<BillPeriodProps | null>();

  // TODO: REACT CANT DIF REALM OBJECTS
  // const onPrint = useCallback(() => {
  const onPrint = async (billPeriod: BillPeriodProps) => {
    // const bills = await billPeriod.bills.fetch();
    const commands = await periodReport(billPeriod, database);
    console.log('commands', commands);
    print(commands);
  };
  // }, [allBills, categories, discounts, paymentTypes]);

  // const { billPeriod, setBillPeriod } = useContext(BillPeriodContext);

  // const closePeriod: (billPeriod: BillPeriodProps) => void = () => {
  //   const openBills = allBills.filtered('isClosed = false');
  //   if (openBills.length > 0) {
  //     Toast.show({
  //       text: `There are currently ${openBills.length} open bills, please close these first.`,
  //       buttonText: 'Okay',
  //       duration: 5000,
  //     });
  //   } else {
  //     realm.write(() => {
  //       billPeriod.closed = new Date();
  //       const newBillPeriod = realm.create(BillPeriodSchema.name, { _id: uuidv4(), opened: new Date() });
  //       setBillPeriod(newBillPeriod);
  //     });
  //     onPrint(billPeriod);
  //   }
  // };

  // const confirmClosePeriod = (billPeriod: BillPeriodProps) => {
  //   const options = ['Yes', 'Cancel'];
  //   ActionSheet.show(
  //     {
  //       options,
  //       cancelButtonIndex: options.length,
  //       title: 'Close current billing period and print report?',
  //     },
  //     index => {
  //       index === 0 && closePeriod(billPeriod);
  //     },
  //   );
  // };
  console.log('billPeriod', billPeriod);

  // useEffect(() => {
  //   effect

  // }, [paymentTypes, periodItems, periodDiscounts,periodPayments ])

  const {breakdown: paymentTotals} = paymentSummary(periodPayments, paymentTypes);
  return (
    <Container>
      <SidebarHeader title="Reports" onOpen={openDrawer} />
      {/* <Protected code={ORG_PASSCODE} navigation={navigation}> */}
      <Content>
        <Grid>
          <Col>
            <View style={{ padding: 20 }}>
              <Text>Current sale period</Text>
              <View style={{ padding: 20 }}>
                <Text>Opened: {dayjs(billPeriod.createdAt).format('DD/MM/YYYY HH:mm:ss')}</Text>
                {paymentTotals.map(({ total, name }) => (
                  <Text>
                    {capitalize(name)}: {formatNumber(total, symbol)}
                  </Text>
                ))}
              </View>

              <Button disabled={false} onPress={() => onPrint(billPeriod)}>
                <Text>Close Period</Text>
              </Button>
            </View>
            {/* <ReportsList
            billPeriods={billPeriods}
            selectedReport={selectedBillPeriod}
            onSelectReport={report => setSelectedBillPeriod(report)}
            onPressClosePeriod={confirmClosePeriod}
          /> */}
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
      </Content>
      {/* </Protected> */}
    </Container>
  );
};

const enhance = c =>
  withDatabase<any>(
    withBillPeriod(
      withObservables(['billPeriod'], ({ billPeriod, database }) => ({
        billPeriod,
        openBills: billPeriod.openBills,
        // bills: billPeriod.bills,
        // periodItems: billPeriod.periodItems,
        // periodDiscounts: billPeriod.periodDiscounts,
        periodPayments: billPeriod.periodPayments,
        paymentTypes: database.collections
          .get(tNames.paymentTypes)
          .query()
          .fetch(),
      }))(c),
    ),
  );

export const Reports = enhance(ReportsInner);

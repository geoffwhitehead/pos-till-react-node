import React, { useEffect, useState } from 'react';
import {
  Toast,
  Container,
  Grid,
  Col,
  Text,
  ActionSheet,
  Button,
  Content,
  List,
  ListItem,
  Left,
  Right,
} from '../../core';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
// import { Protected } from './Protected';
import { periodReport } from '../../services/printer/periodReport';
// import { ReportsList } from './sub-components/ReportsList/ReportsList';
// import { ReportReceipt } from './sub-components/ReportReceipt/ReportReceipt';
import { print } from '../../services/printer/printer';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { tableNames } from '../../models';
import dayjs from 'dayjs';
import { View } from 'react-native';

// const ORG_PASSCODE = '1234'; // TODO: move to an org setting and hash
// const symbol = '£'; // TODO move

export const ReportsInner = ({ database, navigation, billPeriods }) => {
  const openDrawer = () => navigation.openDrawer();
  const onPrint = async (billPeriod: any) => {
    const commands = await periodReport(billPeriod, database);
    print(commands);
  };

  const closePeriod = async billPeriod => {
    await database.action(async () => await billPeriod.closePeriod());
    onPrint(billPeriod);
  };

  const confirmClosePeriod = async (billPeriod: any) => {
    const openBills = await billPeriod.openBills.fetch();
    if (openBills.length > 0) {
      Toast.show({
        text: `There are currently ${openBills.length} open bills, please close these first.`,
        buttonText: 'Okay',
        duration: 5000,
      });
    } else {
      const options = ['Yes', 'Cancel'];
      ActionSheet.show(
        {
          options,
          cancelButtonIndex: options.length,
          title: 'Close current billing period and print report?',
        },
        async index => {
          index === 0 && (await closePeriod(billPeriod));
        },
      );
    }
  };
  const sorterOpenedAtDescending = (p1, p2) => p2.createdAt - p1.createdAt;

  const [periods, setPeriods] = useState([]);

  useEffect(() => {
    setPeriods(
      billPeriods
        .slice()
        .sort(sorterOpenedAtDescending)
        .slice(0, 4),
    );
  }, [billPeriods]);
  return (
    <Container>
      <SidebarHeader title="Reports" onOpen={openDrawer} />
      {/* <Protected code={ORG_PASSCODE} navigation={navigation}> */}
      <Content>
        <Grid>
          <Col>
            <List>
              <ListItem itemHeader first>
                <Text style={{ fontWeight: 'bold' }}>Recent bill periods</Text>
              </ListItem>
              {periods.map(bP => {
                return (
                  <ListItem key={bP.id}>
                    <Left>
                      <View style={{ display: 'flex' }}>
                        <Text>{dayjs(bP.createdAt).format('ddd DD/MM/YYYY HH:mm:ss')}</Text>
                        <Text>{bP.closedAt ? dayjs(bP.closedAt).format('ddd DD/MM/YYYY HH:mm:ss') : ''}</Text>
                      </View>
                    </Left>
                    <Right>
                      {!bP.closedAt && (
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                          <Button small info style={{ marginRight: 2 }} onPress={() => onPrint(bP)}>
                            <Text>Print Status Report</Text>
                          </Button>
                          <Button small danger onPress={() => confirmClosePeriod(bP)}>
                            <Text>Close Period</Text>
                          </Button>
                        </View>
                      )}
                      {bP.closedAt && (
                        <Button small onPress={() => onPrint(bP)}>
                          <Text>Print End Period Report</Text>
                        </Button>
                      )}
                    </Right>
                  </ListItem>
                );
              })}
            </List>
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
    withObservables<any, any>([], ({ database }) => ({
      paymentTypes: database.collections.get(tableNames.paymentTypes).query(),
      billPeriods: database.collections.get(tableNames.billPeriods).query(),
    }))(c),
  );

export const Reports = enhance(ReportsInner);

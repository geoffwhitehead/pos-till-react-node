import React, { useContext } from 'react';
import { Text, Container, Button, List, ListItem, Left, Body, Right } from '../../core';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
import { BillPeriodSchema, BillProps, BillSchema, BillPeriodProps } from '../../services/schemas';
import { BillPeriodContext } from '../../contexts/BillPeriodContext';
import { realm } from '../../services/Realm';
import uuidv4 from 'uuid';
import { routes } from '../../navigators/SidebarNavigator';
import { Fonts } from '../../theme';
import { StyleSheet, View } from 'react-native';
import { Protected } from './Protected';
import { useRealmQuery } from 'react-use-realm';
import { print } from '../../services/printer/printer';
import { periodReport } from '../../services/printer/periodReport';
import dayjs from 'dayjs';

const ORG_PASSCODE = '1234'; // TODO: move to an org setting

export const Reports = ({ navigation }) => {
  const { billPeriod, setBillPeriod } = useContext(BillPeriodContext);
  const openDrawer = () => navigation.openDrawer();
  const billPeriods = useRealmQuery<BillPeriodProps>({ source: BillPeriodSchema.name, sort: [['opened', true]] });
  const allBills = useRealmQuery<BillProps>({
    source: BillSchema.name,
  });

  const printEndOfDayReport = () => {
    console.log('Print report');
  };
  const closeCurrentDay = () => {
    realm.write(() => {
      billPeriod.closed = new Date();
      const newBillPeriod = realm.create(BillPeriodSchema.name, { _id: uuidv4(), opened: new Date() });
      setBillPeriod(newBillPeriod);
      // navigation.navigate(routes.checkout);
    });
  };

  const onPrint = (billPeriod: BillPeriodProps) => () => {
    const periodBills = allBills.filter(bill => {
      console.log('bill', bill.billPeriod._id);
      console.log('billPeriod', billPeriod._id);
      return bill.billPeriod._id === billPeriod._id;
    });
    console.log('periodBills', periodBills);
    // const bills = useRealmQuery<BillProps>({
    //   source: BillSchema.name,
    //   filter: `billPeriod._id = $0`,
    //   variables: [billPeriod._id],
    // });
    // const commands = periodReport(periodBills);
    // print(commands);
  };

  return (
    <Container>
      <SidebarHeader title="Reports" onOpen={openDrawer} />
      <Protected code={ORG_PASSCODE} navigation={navigation}>
        <View style={styles.container}>
          <Button bordered style={styles.button} onPress={printEndOfDayReport}>
            <Text>Print daily report</Text>
          </Button>
          <Button large style={styles.button} onPress={closeCurrentDay}>
            <Text>End current day</Text>
          </Button>
        </View>
        <List>
          <ListItem itemHeader>
            <Left>
              <Text>Opened</Text>
            </Left>
            <Body>
              <Text>Closed</Text>
            </Body>
            <Right />
          </ListItem>
          {billPeriods.slice(0, 3).map(billPeriod => (
            <ListItem>
              <Left>
                <Text>{dayjs(billPeriod.opened).toString()}</Text>
              </Left>
              <Body>
                <Text>{billPeriod.closed && dayjs(billPeriod.closed).toString()}</Text>
              </Body>
              <Right>
                <Button onPress={onPrint(billPeriod)}>
                  <Text>Print</Text>
                </Button>
              </Right>
            </ListItem>
          ))}
        </List>
      </Protected>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center' },
  icon: { width: 50, height: 50 },
  button: { ...Fonts.h1, margin: 25 },
  text: { ...Fonts.h3, margin: 20 },
});

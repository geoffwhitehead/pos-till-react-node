import React, { useContext } from 'react';
import { Text, Content, Container, Button } from '../../core';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
import { BillPeriodSchema } from '../../services/schemas';
import { BillPeriodContext } from '../../contexts/BillPeriodContext';
import { realm } from '../../services/Realm';
import uuidv4 from 'uuid';
import { routes } from '../../navigators/SidebarNavigator';
import { Fonts } from '../../theme';
import { StyleSheet, View } from 'react-native';

export const Reports = ({ navigation }) => {
  const { billPeriod, setBillPeriod } = useContext(BillPeriodContext);
  const openDrawer = () => navigation.openDrawer();

  const printEndOfDayReport = () => {
    console.log('Print report');
  };

  const closeCurrentDay = () => {
    realm.write(() => {
      billPeriod.closed = Date();
      const newBillPeriod = realm.create(BillPeriodSchema.name, { _id: uuidv4() });
      setBillPeriod(newBillPeriod);
      navigation.navigate(routes.checkout);
    });
  };

  return (
    <Container>
      <SidebarHeader title="Reports" onOpen={openDrawer} />
      <View style={styles.container}>
        <Button bordered style={styles.button} onPress={printEndOfDayReport}>
          <Text>Print daily report</Text>
        </Button>
        <Button large style={styles.button} onPress={closeCurrentDay}>
          <Text>End current day</Text>
        </Button>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center' },
  icon: { width: 50, height: 50 },
  button: { ...Fonts.h1, margin: 25 },
  text: { ...Fonts.h3, margin: 20 },
});

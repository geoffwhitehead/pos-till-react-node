import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Tab, Tabs } from 'native-base';
import React from 'react';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
import { SidebarDrawerStackParamList } from '../../navigators/SidebarNavigator';
import { ReportsTab } from './Tabs/ReportsTab/ReportsTab';
import { StockReportsTab } from './Tabs/StockReportsTab/StockReportsTab';

interface ReportsOuterProps {
  navigation: DrawerNavigationProp<SidebarDrawerStackParamList, 'Reports'>;
}
// const ORG_PASSCODE = '1234'; // TODO: move to an org setting and hash

interface ReportsInnerProps {}
const ReportsInner: React.FC<ReportsOuterProps & ReportsInnerProps> = ({ navigation }) => {
  return (
    <>
      <SidebarHeader title="Reports" onOpen={() => navigation.openDrawer()} />
      {/* <Protected code={ORG_PASSCODE} navigation={navigation}> */}

      <Tabs>
        <Tab heading="Daily / Period Reports">
          <ReportsTab navigation={navigation} />
        </Tab>
        <Tab heading="Stock Reports">
          <StockReportsTab />
        </Tab>
      </Tabs>
      {/* </Protected> */}
    </>
  );
};

export const Reports = ReportsInner;

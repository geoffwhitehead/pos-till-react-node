import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Tab, Tabs } from 'native-base';
import React, { useContext } from 'react';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
import { OrganizationContext } from '../../contexts/OrganizationContext';
import { SidebarDrawerStackParamList } from '../../navigators/SidebarNavigator';
import { Protected } from './Protected';
import { ReportsTab } from './Tabs/ReportsTab/ReportsTab';
import { StockReportsTab } from './Tabs/StockReportsTab/StockReportsTab';

interface ReportsOuterProps {
  navigation: DrawerNavigationProp<SidebarDrawerStackParamList, 'Reports'>;
}

interface ReportsInnerProps {}

const ReportsInner: React.FC<ReportsOuterProps & ReportsInnerProps> = ({ navigation }) => {
  const { organization } = useContext(OrganizationContext);
  return (
    <>
      <SidebarHeader title="Reports" onOpen={() => navigation.openDrawer()} />
      <Protected code={organization.accessPin} navigation={navigation} isDisabled={!organization.accessPinEnabled}>
        <Tabs>
          <Tab heading="Daily / Period Reports">
            <ReportsTab navigation={navigation} />
          </Tab>
          <Tab heading="Stock Reports">
            <StockReportsTab />
          </Tab>
        </Tabs>
      </Protected>
    </>
  );
};

export const Reports = ReportsInner;

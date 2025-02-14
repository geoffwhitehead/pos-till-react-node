import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Tab, Tabs } from 'native-base';
import React, { useContext } from 'react';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
import { BillPeriodContext } from '../../contexts/BillPeriodContext';
import { SidebarDrawerStackParamList } from '../../navigators/SidebarNavigator';
import { DiscountsTab } from './Tabs/DiscountsTab/DiscountsTab';
import { OrganizationTab } from './Tabs/OrganizationTab/OrganizationTab';
import { PrinterGroupsTab } from './Tabs/PrinterGroups/PrinterGroupsTab';
import { PrintersTab } from './Tabs/PrintersTab/PrintersTab';
import { SettingsTab } from './Tabs/SettingsTab/SettingsTab';

interface SettingsOuterProps {
  navigation: DrawerNavigationProp<SidebarDrawerStackParamList, 'Settings'>;
}

interface SettingsInnerProps {}
const SettingsInner: React.FC<SettingsOuterProps & SettingsInnerProps> = ({ navigation }) => {
  const { billPeriod } = useContext(BillPeriodContext);
  return (
    <>
      <SidebarHeader title="Settings" onOpen={() => navigation.openDrawer()} />
      <Tabs>
        <Tab heading="Settings">
          <SettingsTab billPeriod={billPeriod} />
        </Tab>
        <Tab heading="Organization Details">
          <OrganizationTab />
        </Tab>
        <Tab heading="Printers">
          <PrintersTab />
        </Tab>
        <Tab heading="Printer Groups">
          <PrinterGroupsTab />
        </Tab>
        <Tab heading="Discounts">
          <DiscountsTab />
        </Tab>
      </Tabs>
    </>
  );
};

export const Settings = SettingsInner;

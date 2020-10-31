import React, { useContext } from 'react';
import { Container, Content } from '../../core';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { SidebarDrawerStackParamList } from '../../navigators/SidebarNavigator';
import { H1, Tabs, Tab } from 'native-base';
import { OrganizationTab } from './sub-components/OrganizationTab';
import { SettingsTab } from './sub-components/SettingsTab';
import { PrintersTab } from './sub-components/PrintersTab';
import { PrinterGroupsTab } from './sub-components/PrinterGroupsTab';
import { PriceGroupsTab } from './sub-components/PriceGroupsTab';
import { BillPeriodContext } from '../../contexts/BillPeriodContext';

interface SettingsOuterProps {
  navigation: DrawerNavigationProp<SidebarDrawerStackParamList, 'Settings'>;
}

interface SettingsInnerProps {}
const SettingsInner: React.FC<SettingsOuterProps & SettingsInnerProps> = ({ navigation }) => {
  const { billPeriod } = useContext(BillPeriodContext);
  return (
    <Container>
      <SidebarHeader title="Settings" onOpen={() => navigation.openDrawer()} />
      <Content>
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
          <Tab heading="Price Groups">
            <PriceGroupsTab />
          </Tab>
        </Tabs>
      </Content>
    </Container>
  );
};

export const Settings = SettingsInner;

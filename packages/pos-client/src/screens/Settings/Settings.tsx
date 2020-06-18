import React, { useContext } from 'react';
import {
  Container,
  Content,
  Form,
  Item,
  Label,
  Input,
  Text,
  Card,
  Body,
  CardItem,
  Grid,
  Col,
  Row,
  Picker,
  Icon,
} from '../../core';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { SidebarDrawerStackParamList } from '../../navigators/SidebarNavigator';
import { OrganizationContext } from '../../contexts/OrganizationContext';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { tableNames, PaymentType, Printer, Organization, PriceGroup } from '../../models';
import { Database } from '@nozbe/watermelondb';
import { Formik } from 'formik';
import { signUp } from '../../api/auth';
import * as Yup from 'yup';
import { Loading } from '../../components/Loading/Loading';
import { Header } from 'react-native/Libraries/NewAppScreen';
import { H1, Tabs, Tab } from 'native-base';
import { OrganizationTab } from './sub-components/OrganizationTab';
import { SettingsTab } from './sub-components/SettingsTab';
import { PrintersTab } from './sub-components/PrintersTab';
import { PrinterGroupsTab } from './sub-components/PrinterGroupsTab';

interface SettingsOuterProps {
  navigation: DrawerNavigationProp<SidebarDrawerStackParamList, 'Settings'>;
}

interface SettingsInnerProps {}
const SettingsInner: React.FC<SettingsOuterProps & SettingsInnerProps> = ({ navigation }) => {
  return (
    <Container>
      <SidebarHeader title="Settings" onOpen={() => navigation.openDrawer()} />
      <Content>
        <Tabs>
          <Tab heading="Settings">
            <SettingsTab />
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
        </Tabs>
      </Content>
    </Container>
  );
};

export const Settings = SettingsInner;

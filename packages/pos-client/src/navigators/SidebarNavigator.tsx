import { createDrawerNavigator } from '@react-navigation/drawer';
import { Checkout } from '../screens/Checkout/Checkout';
import { Items } from '../screens/Items/Items';
import { Reports } from '../screens/Reports/Reports';
import { Bills } from '../screens/Bills/Bills';
import { Transactions } from '../screens/Transactions/Transactions';

import React from 'react';

export const sidebarRoutes: Record<string, string> = {
  checkout: 'Checkout',
  items: 'Items',
  reports: 'Reports',
  bills: 'Bills',
  transactions: 'Transactions',
};

export type SidebarDrawerStackParamList = {
  Checkout: undefined;
  Items: undefined;
  Reports: undefined;
  Bills: undefined;
  Transactions: undefined;
};

export const SidebarNavigator: React.FC<{}> = () => {
  const Drawer = createDrawerNavigator<SidebarDrawerStackParamList>();

  return (
    <Drawer.Navigator initialRouteName="Checkout">
      <Drawer.Screen name="Checkout" component={Checkout} />
      <Drawer.Screen name="Items" component={Items} />
      <Drawer.Screen name="Reports" component={Reports} />
      <Drawer.Screen name="Bills" component={Bills} />
      <Drawer.Screen name="Transactions" component={Transactions} />
    </Drawer.Navigator>
  );
};

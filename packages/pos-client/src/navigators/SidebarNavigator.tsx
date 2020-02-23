import { createDrawerNavigator } from '@react-navigation/drawer';
import { Checkout } from '../pages/Checkout/Checkout';
import { Items } from '../pages/Items/Items';
import { Reports } from '../pages/Reports/Reports';
import { Bills } from '../pages/Bills/Bills';
import { Transactions } from '../pages/Transactions/Transactions';

import React from 'react';

export const routes = {
  checkout: 'Checkout',
  items: 'Items',
  reports: 'Reports',
  bills: 'Bills',
  transactions: 'Transactions',
};

interface SidebarNavigatorProps {}

export const SidebarNavigator: React.FC<SidebarNavigatorProps> = () => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator initialRouteName="Checkout">
      <Drawer.Screen name={routes.checkout} component={Checkout} />
      <Drawer.Screen name={routes.items} component={Items} />
      <Drawer.Screen name={routes.reports} component={Reports} />
      <Drawer.Screen name={routes.bills} component={Bills} />
      <Drawer.Screen name={routes.transactions} component={Transactions} />
    </Drawer.Navigator>
  );
};

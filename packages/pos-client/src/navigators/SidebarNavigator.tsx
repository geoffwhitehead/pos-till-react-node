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

interface SidebarNavigatorProps {
  billPeriod: any; // TODO
}

export const SidebarNavigator: React.FC<SidebarNavigatorProps> = ({ billPeriod }) => {
  const Drawer = createDrawerNavigator();

  const routeParams = {
    initialParams: { billPeriod },
  };

  return (
    <Drawer.Navigator initialRouteName="Checkout">
      <Drawer.Screen {...routeParams} name={routes.checkout} component={Checkout} />
      <Drawer.Screen name={routes.items} component={Items} />
      <Drawer.Screen {...routeParams} name={routes.reports} component={Reports} />
      <Drawer.Screen name={routes.bills} component={Bills} />
      <Drawer.Screen {...routeParams} name={routes.transactions} component={Transactions} />
    </Drawer.Navigator>
  );
};

import { createDrawerNavigator } from '@react-navigation/drawer'
import { Checkout } from '../pages/Checkout/Checkout'
import { Items } from '../pages/Items/Items'
import { Reports } from '../pages/Reports/Reports'
import { Bills } from '../pages/Bills/Bills'
import { Transactions } from '../pages/Transactions/Transactions'

import React from 'react'

export const SidebarNavigator = () => {
  const Drawer = createDrawerNavigator()
  return (
    <Drawer.Navigator initialRouteName="Checkout">
      <Drawer.Screen name="Checkout" component={Checkout} />
      <Drawer.Screen name="Items" component={Items} />
      <Drawer.Screen name="Reports" component={Reports} />
      <Drawer.Screen name="Bills" component={Bills} />
      <Drawer.Screen name="Transactions" component={Transactions} />
    </Drawer.Navigator>
  )
}

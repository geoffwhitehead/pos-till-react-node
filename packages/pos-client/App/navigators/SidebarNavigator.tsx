import { createDrawerNavigator } from '@react-navigation/drawer'
import { Checkout } from '../pages/Checkout/Checkout'
import { SplashScreen } from '../pages/SplashScreen/SplashScreen'
import React from 'react'

export const SidebarNavigator = () => {
  const Drawer = createDrawerNavigator()
  return (
    <Drawer.Navigator initialRouteName="Checkout">
      <Drawer.Screen name="Checkout" component={Checkout} />
      <Drawer.Screen name="Temp" component={SplashScreen} />
    </Drawer.Navigator>
  )
}

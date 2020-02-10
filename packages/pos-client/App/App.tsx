import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import Realm from 'realm'
import { NavigationContainer } from '@react-navigation/native'
// const { store, persistor } = createStore()
import { Checkout } from './Pages/Checkout/Checkout'

import { createStackNavigator } from '@react-navigation/stack'
const Stack = createStackNavigator()

export default () => {
  return (
    // <Provider store={store}>
    // <PersistGate loading={null} persistor={persistor}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Checkout">
        <Stack.Screen name="Checkout" component={Checkout} />
      </Stack.Navigator>
    </NavigationContainer>
    // </PersistGate>
    // </Provider>
  )
}

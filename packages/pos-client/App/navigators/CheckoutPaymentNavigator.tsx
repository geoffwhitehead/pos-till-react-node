import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Receipt } from '../pages/Checkout/sub-components/Receipt/Receipt'
import { SelectBill } from '../pages/Checkout/sub-components/SelectBill/SelectBIll'
import { Payment } from '../pages/Checkout/sub-components/Payment/Payment'

export const routes = {
  receipt: 'Receipt',
  selectBill: 'SelectBill',
  payment: 'Payment',
}
export const CheckoutPaymentNavigator = ({ billRegister }) => {
  const Stack = createStackNavigator()

  console.log('billRegister NAV', billRegister)
  return (
    <Stack.Navigator initialRouteName="Receipt" headerMode="none">
      <Stack.Screen name="Receipt" component={Receipt} initialParams={{ billRegister }} />
      <Stack.Screen name="SelectBill" component={SelectBill} initialParams={{ billRegister }} />
      <Stack.Screen name="Payment" component={Payment} initialParams={{ billRegister }} />
    </Stack.Navigator>
  )
}

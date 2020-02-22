import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { CategoryItemsList } from '../pages/Checkout/sub-components/CategoryItemsList/CategoryItemsList'
import { ItemModifierList } from '../pages/Checkout/sub-components/ItemModifierList/ItemModifierList'
import { CategoryList } from '../pages/Checkout/sub-components/CategoryList/CategoryList'
import { SelectBill } from '../pages/Checkout/sub-components/SelectBill/SelectBIll'

const Stack = createStackNavigator()

interface CheckoutItemNavigatorProps {
  activeBill: any; // TODO
}
export const routes = {
  categoryList: 'CategoryList',
  categoryItemList: 'CategoryItemsList',
  itemModifierList: 'ItemModifierList',
  selectBill: 'SelectBill',
}

export const CheckoutItemNavigator: React.FC<CheckoutItemNavigatorProps> = ({ activeBill }) => {
  const routeParams = {
    initialParams: { activeBill },
  }

  return (
    <Stack.Navigator initialRouteName="CategoryList" headerMode="none">
      <Stack.Screen {...routeParams} name="CategoryList" component={CategoryList} />
      <Stack.Screen {...routeParams} name="CategoryItemsList" component={CategoryItemsList} />
      <Stack.Screen {...routeParams} name="ItemModifierList" component={ItemModifierList} />
    </Stack.Navigator>
  )
}

import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { CategoryItemsList } from '../pages/Checkout/sub-components/CategoryItemsList/CategoryItemsList'
import { ItemModifierList } from '../pages/Checkout/sub-components/ItemModifierList/ItemModifierList'
import { CategoryList } from '../pages/Checkout/sub-components/CategoryList/CategoryList'

const Stack = createStackNavigator()

export const routes = {
  categoryList: 'CategoryList',
  categoryItemList: 'CategoryItemsList',
  itemModifierList: 'ItemModifierList',
}

export const CheckoutItemNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="CategoryList" headerMode="none">
      <Stack.Screen name="CategoryList" component={CategoryList} />
      <Stack.Screen name="CategoryItemsList" component={CategoryItemsList} />
      <Stack.Screen name="ItemModifierList" component={ItemModifierList} />
    </Stack.Navigator>
  )
}

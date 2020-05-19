import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CategoryItems, AllItems } from '../pages/Checkout/sub-components/CategoryItemsList/CategoryItemsList';
import { ItemModifierList } from '../pages/Checkout/sub-components/ItemModifierList/ItemModifierList';
import { Categories } from '../pages/Checkout/sub-components/CategoryList/CategoryList';
import { SelectBill } from '../pages/Checkout/sub-components/SelectBill/SelectBIll';

const Stack = createStackNavigator();

export const routes = {
  categoryList: 'CategoryList',
  categoryItemList: 'CategoryItemsList',
  itemModifierList: 'ItemModifierList',
  allItems: 'AllItemsList',
  selectBill: 'SelectBill',
};

export const CheckoutItemNavigator: React.FC = () => {

  return (
    <Stack.Navigator initialRouteName="CategoryList" headerMode="none">
      <Stack.Screen name="CategoryList" component={Categories} />
      <Stack.Screen name="CategoryItemsList" component={CategoryItems} />
      <Stack.Screen name="AllItemsList" component={AllItems} />
      <Stack.Screen name="ItemModifierList" component={ItemModifierList} />
    </Stack.Navigator>
  );
};

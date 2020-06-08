import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CategoryItems, AllItems } from '../screens/Checkout/sub-components/CategoryItemsList/CategoryItemsList';
import { ItemModifierList } from '../screens/Checkout/sub-components/ItemModifierList/ItemModifierList';
import { Categories } from '../screens/Checkout/sub-components/CategoryList/CategoryList';
import { Category, Modifier } from '../models';

const Stack = createStackNavigator();

export const routes = {
  categoryList: 'CategoryList',
  categoryItemList: 'CategoryItemsList',
  itemModifierList: 'ItemModifierList',
  allItems: 'AllItemsList',
};

export type CheckoutItemStackParamList = {
  CategoryList: undefined;
  CategoryItemsList: { category: Category };
  ItemModifierList: { modifier: Modifier };
  AllItemsList: undefined;
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

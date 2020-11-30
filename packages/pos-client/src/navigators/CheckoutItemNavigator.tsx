import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Category } from '../models';
import { CategoryItems } from '../screens/Checkout/sub-components/CategoryItemsList/CategoryItemsList';
import { Categories } from '../screens/Checkout/sub-components/CategoryList/CategoryList';

const Stack = createStackNavigator();

export const routes = {
  categoryList: 'CategoryList',
  categoryItemList: 'CategoryItemsList',
};

export type CheckoutItemStackParamList = {
  CategoryList: undefined;
  CategoryItemsList: { category: Category; priceGroupId: string };
};

export const CheckoutItemNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="CategoryList" headerMode="none">
      <Stack.Screen name="CategoryList" component={Categories} />
      <Stack.Screen name="CategoryItemsList" component={CategoryItems} />
    </Stack.Navigator>
  );
};

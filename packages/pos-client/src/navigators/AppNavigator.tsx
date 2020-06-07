import { AuthNavigator } from './AuthNavigator';
import { createStackNavigator } from '@react-navigation/stack';
import { Main } from '../screens/Main/Main';

import React from 'react';

// TODO: fix type
export const AppNavigator = (accessToken: string, refreshToken: string) => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      {!accessToken || !refreshToken ? (
        // No token found, user isn't signed in
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        // User is signed in
        <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
};

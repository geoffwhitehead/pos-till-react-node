import { AuthNavigator } from './AuthNavigator'
import { createStackNavigator } from '@react-navigation/stack'
import { Main } from '../pages/Main/Main'

import React from 'react'

// TODO: fix type
export const AppNavigator = (token: any, isPopulated: boolean) => {
  const Stack = createStackNavigator()

  return (
    <Stack.Navigator>
      {token == null ? (
        // No token found, user isn't signed in
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        // User is signed in
        <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  )
}

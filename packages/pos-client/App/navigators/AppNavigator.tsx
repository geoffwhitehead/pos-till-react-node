import { NavigationContainer } from '@react-navigation/native'
import { SidebarNavigator } from './SidebarNavigator'
import { AuthNavigator } from './AuthNavigator'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

// TODO: fix type
export const AppNavigator = (token: any, isPopulated: boolean) => {
  const Stack = createStackNavigator()

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {token == null ? (
          // No token found, user isn't signed in
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          // User is signed in
          <Stack.Screen
            name="Sidebar"
            component={SidebarNavigator}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

import { createStackNavigator } from '@react-navigation/stack'
import { SignUp } from '../pages/SignUp/SignUp'
import { SignIn } from '../pages/SignIn/SignIn'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'

export const AuthNavigator = () => {
  const Stack = createStackNavigator()

  return (
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{
            title: 'SignIn',
            // When logging out, a pop animation feels intuitive
            // You can remove this if you want the default 'push' animation
            // animationTypeForReplace: state.isSignout ? 'pop' : 'push',
          }}
        />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
  )
}

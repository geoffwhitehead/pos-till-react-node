import { createStackNavigator } from '@react-navigation/stack'
import { SignUp } from '../screens/SignUp/SignUp'
import { SignIn } from '../screens/SignIn/SignIn'
import React from 'react'

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};


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

import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Organization } from '../models';
import { SignIn } from '../screens/Auth/SignIn/SignIn';
import { SignUp } from '../screens/Auth/SignUp/SignUp';

export type AuthStackParamList = {
  SignIn: {
    organization?: Organization;
  };
  SignUp: undefined;
};

export const AuthNavigator: React.FC<{}> = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="SignIn" headerMode="none">
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{
          animationTypeForReplace: 'pop',
        }}
      />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};

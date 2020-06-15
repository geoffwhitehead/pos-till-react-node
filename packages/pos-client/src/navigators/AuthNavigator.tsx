import { Database } from '@nozbe/watermelondb';
import { Organization, tableNames } from '../models';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { createStackNavigator } from '@react-navigation/stack';
import { Loading } from '../components/Loading/Loading';
import { SignUp } from '../screens/Auth/SignUp/SignUp';
import { SignIn } from '../screens/Auth/SignIn/SignIn';
import { database } from '../database';
import React from 'react'

interface AuthNavigatorInnerProps {
  database: Database;
  organization: Organization[];
}

export type AuthStackParamList = {
  SignIn: {
    organization?: Organization;
  };
  SignUp: undefined;
};

export const AuthNavigatorInner: React.FC<AuthNavigatorInnerProps> = ({ organization }) => {
  if (!organization) {
    return <Loading />;
  }

  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="SignIn">
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        initialParams={{
          organization: organization.length ? organization[0] : null,
        }}
        options={{
          title: 'SignIn',
          animationTypeForReplace: 'pop',
        }}
      />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};

const enhance = c =>
  withDatabase(
    withObservables([], () => ({
      organization: database.collections
        .get<Organization>(tableNames.organizations)
        .query()
    }))(c),
  );

export const AuthNavigator = enhance(AuthNavigatorInner);

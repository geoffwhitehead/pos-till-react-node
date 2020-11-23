import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Loading } from '../components/Loading/Loading';
import { database } from '../database';
import { Organization, tableNames } from '../models';
import { SignIn } from '../screens/Auth/SignIn/SignIn';
import { SignUp } from '../screens/Auth/SignUp/SignUp';

interface AuthNavigatorInnerProps {
  database: Database;
  organizations: Organization[];
}

export type AuthStackParamList = {
  SignIn: {
    organization?: Organization;
  };
  SignUp: undefined;
};

export const AuthNavigatorInner: React.FC<AuthNavigatorInnerProps> = ({ database, organizations }) => {
  if (!organizations) {
    return <Loading />;
  }

  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="SignIn" headerMode="none">
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        initialParams={{
          organization: organizations.length ? organizations[0] : null,
        }}
        options={{
          animationTypeForReplace: 'pop',
        }}
      />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};

const enhance = c =>
  withDatabase(
    withObservables(null, () => ({
      organizations: database.collections.get<Organization>(tableNames.organizations).query(),
    }))(c),
  );

export const AuthNavigator = enhance(AuthNavigatorInner);

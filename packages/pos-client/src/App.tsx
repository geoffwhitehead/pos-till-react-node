import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import decode from 'jwt-decode';
import { Root } from 'native-base';
import React from 'react';
import { api } from './api';
import { signIn, signUp } from './api/auth';
import { Sync } from './components/Sync/Sync';
import { AuthContext } from './contexts/AuthContext';
import { database, resetDatabase } from './database';
import { AuthNavigator } from './navigators/AuthNavigator';
import { Main } from './screens/Main/Main';
import { SplashScreen } from './screens/SplashScreen/SplashScreen';
import { drawerTheme } from './theme';

export const App = () => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            accessToken: action.accessToken,
            refreshToken: action.refreshToken,
            organizationId: action.organizationId,
            userId: action.userId,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            accessToken: action.accessToken,
            refreshToken: action.refreshToken,
            organizationId: action.organizationId,
            userId: action.userId,
            isLoading: false,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            accessToken: null,
            refreshToken: null,
            organizationId: null,
            userId: null,
            isLoading: false,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      accessToken: null,
      refreshToken: null,
      organizationId: null,
      userId: null,
    },
  );

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let accessToken;
      let refreshToken;
      let organizationId;
      let userId;
      // await resetDatabase();
      // await unsetAuth();
      try {
        const [aToken, rToken] = await AsyncStorage.multiGet(['accessToken', 'refreshToken']);
        accessToken = aToken[1];
        refreshToken = rToken[1];
      } catch (e) {
        console.error('Fetching tokens from local storage failed');
      }

      if (!accessToken || !refreshToken) {
        unsetAuth();
      }

      try {
        const decodedToken = decode(refreshToken);
        if (decodedToken.exp < new Date().getTime() / 1000) {
          unsetAuth();
          return;
        } else {
          organizationId = decodedToken.organizationId;
          userId = decodedToken.userId;
        }
      } catch (e) {
        unsetAuth();
        return;
      }

      api.setHeader('authorization', accessToken);
      api.setHeader('x-refresh-token', refreshToken);

      dispatch({ type: 'RESTORE_TOKEN', accessToken, refreshToken, organizationId, userId });
      // dispatch({ type: 'SIGN_OUT' });
    };

    bootstrapAsync();
  }, []);

  const unsetAuth = async () => {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'organizationId', 'userId']);
    api.setHeader('authorization', '');
    api.setHeader('x-refresh-token', '');
    dispatch({ type: 'SIGN_OUT' });
  };

  const setAuth = async (params: {
    accessToken: string;
    refreshToken: string;
    organizationId: string;
    userId: string;
  }) => {
    const { accessToken, refreshToken, organizationId, userId } = params;
    api.setHeader('authorization', accessToken);
    api.setHeader('x-refresh-token', refreshToken);
    await AsyncStorage.multiSet([
      ['accessToken', accessToken],
      ['refreshToken', refreshToken],
      ['userId', userId],
      ['organizationId', organizationId],
    ]);
    dispatch({ type: 'SIGN_IN', accessToken, refreshToken, organizationId, userId });
  };

  const authContext = React.useMemo(
    () => ({
      signIn: async params => {
        try {
          const response = await signIn(params);

          if (response.data.success) {
            const accessToken = response.headers['authorization'];
            const refreshToken = response.headers['x-refresh-token'];

            await setAuth({
              accessToken,
              refreshToken,
              organizationId: response.data.data.organizationId,
              userId: response.data.data._id,
            });
          } else {
            throw new Error('Sign in failed');
          }
        } catch (err) {
          // TODO: alert the user
          console.log('Error signing in', err);
        }
      },
      signOut: async () => {
        try {
          await unsetAuth();
        } catch (err) {
          console.error('sign out failed', err);
        }
      },
      signUp: async data => {
        // TODO: handle errors

        try {
          const response = await signUp(data);

          if (response.data.success) {
            const accessToken = response.headers['authorization'];
            const refreshToken = response.headers['x-refresh-token'];
            await setAuth({
              accessToken,
              refreshToken,
              organizationId: response.data.data.organizationId,
              userId: response.data.data._id,
            });
          } else {
            throw new Error('Sign up failed');
          }
        } catch (err) {
          console.error('Sign up failed', err);
        }
      },
      unlink: async () => {
        try {
          await resetDatabase();
          await unsetAuth();
        } catch (err) {
          console.error('sign out failed', err);
        }
      },
    }),
    [],
  );

  const { isLoading, refreshToken, accessToken, userId, organizationId } = state;

  if (isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }

  return (
    // {/* native base wrapper */}

    <Root>
      {/*  react-navigation wrapper */}
      <DatabaseProvider database={database}>
        <NavigationContainer theme={drawerTheme}>
          <AuthContext.Provider value={authContext}>
            {!accessToken || !refreshToken || !organizationId || !userId ? (
              // login etc
              <AuthNavigator />
            ) : (
              // user is authenticated
              // <AuthContext.Provider value={authContext}>
              <Sync database={database} organizationId={organizationId}>
                <Main organizationId={organizationId} userId={userId} />
              </Sync>
              // </AuthContext.Provider>
            )}
          </AuthContext.Provider>
        </NavigationContainer>
      </DatabaseProvider>
    </Root>
  );
};

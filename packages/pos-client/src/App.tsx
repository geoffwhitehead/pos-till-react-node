import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import decode from 'jwt-decode';
import { Root } from 'native-base';
import React from 'react';
import { api } from './api';
import { signIn, SignInParams, signUp, SignUpParams } from './api/auth';
import { Sync } from './components/Sync/Sync';
import { AuthContext } from './contexts/AuthContext';
import { database, resetDatabase } from './database';
import { AuthNavigator } from './navigators/AuthNavigator';
import { Main } from './screens/Main/Main';
import { SplashScreen } from './screens/SplashScreen/SplashScreen';
import { drawerTheme } from './theme';
import { toast } from './utils/toast';

type ReducerState = {
  isSignout: boolean;
  accessToken: string;
  refreshToken: string;
  organizationId: string;
  userId: string;
  isLoading: boolean;
  isSignInLoading: boolean;
  isSignUpLoading: boolean;
};

type RestoreTokenActionProps = Pick<ReducerState, 'accessToken' | 'refreshToken' | 'organizationId' | 'userId'>;
type SignInSuccessActionProps = Pick<ReducerState, 'accessToken' | 'refreshToken' | 'organizationId' | 'userId'>;

type ReducerAction =
  | ({ type: 'RESTORE_TOKEN' } & RestoreTokenActionProps)
  | { type: 'SIGN_IN_REQUEST' }
  | ({ type: 'SIGN_IN_SUCCESS' } & SignInSuccessActionProps)
  | { type: 'SIGN_IN_FAILED' }
  | { type: 'SIGN_UP_REQUEST' }
  | { type: 'SIGN_UP_SUCCESS' }
  | { type: 'SIGN_UP_FAILED' }
  | { type: 'SIGN_OUT' };

export const App: React.FC<{}> = () => {
  // if (env === 'local') {
  //   const whyDidYouRender = require('@welldone-software/why-did-you-render');
  //   whyDidYouRender(React, {
  //     trackAllPureComponents: true,
  //   });
  // }

  const reducer = (state: ReducerState, action: ReducerAction) => {
    switch (action.type) {
      case 'RESTORE_TOKEN':
        return {
          ...state,
          accessToken: action.accessToken,
          refreshToken: action.refreshToken,
          organizationId: action.organizationId,
          userId: action.userId,
          isLoading: false,
        };
      case 'SIGN_IN_SUCCESS':
        return {
          ...state,
          isSignout: false,
          accessToken: action.accessToken,
          refreshToken: action.refreshToken,
          organizationId: action.organizationId,
          userId: action.userId,
          isLoading: false,
          isSignInLoading: false,
        };
      case 'SIGN_IN_REQUEST':
        return {
          ...state,
          isSignInLoading: true,
        };
      case 'SIGN_IN_FAILED':
        return {
          ...state,
          isSignInLoading: false,
        };

      case 'SIGN_UP_REQUEST':
        return {
          ...state,
          isSignUpLoading: true,
        };
      case 'SIGN_UP_SUCCESS':
        return {
          ...state,
          isSignUpLoading: false,
        };
      case 'SIGN_UP_FAILED':
        return {
          ...state,
          isSignUpLoading: false,
        };
      case 'SIGN_OUT':
        return {
          ...state,
          isSignout: true,
          accessToken: null,
          refreshToken: null,
          organizationId: null,
          userId: null,
          isLoading: false,
        };
    }
  };
  const [state, dispatch] = React.useReducer(reducer, {
    isLoading: true,
    isSignout: false,
    accessToken: null,
    refreshToken: null,
    organizationId: null,
    userId: null,
    isSignInLoading: false,
    isSignUpLoading: false,
  });

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
  };

  const authContext = React.useMemo(
    () => ({
      signIn: async (params: SignInParams) => {
        try {
          dispatch({ type: 'SIGN_IN_REQUEST' });
          const response = await signIn(params);

          if (response.data.success) {
            const accessToken = response.headers['authorization'];
            const refreshToken = response.headers['x-refresh-token'];

            const organizationId = response.data.data.organizationId;
            const userId = response.data.data.userId;

            await setAuth({
              accessToken,
              refreshToken,
              organizationId,
              userId,
            });

            dispatch({ type: 'SIGN_IN_SUCCESS', accessToken, refreshToken, organizationId, userId });
          } else {
            throw new Error('Sign in failed');
          }
        } catch (err) {
          dispatch({ type: 'SIGN_IN_FAILED' });
          toast({ message: 'Failed to sign in' });
        }
      },
      signOut: async () => {
        try {
          await unsetAuth();
        } catch (err) {
          toast({ message: 'Failed to sign out' });
        }
      },
      signUp: async (bodyData: SignUpParams) => {
        // TODO: handle errors
        try {
          dispatch({ type: 'SIGN_UP_REQUEST' });

          const response = await signUp(bodyData);
          if (response.data.success) {
            const accessToken = response.headers['authorization'];
            const refreshToken = response.headers['x-refresh-token'];
            await setAuth({
              accessToken,
              refreshToken,
              organizationId: response.data.data.organizationId,
              userId: response.data.data.userId,
            });
            toast({ message: 'Successfully signed up, please login.', type: 'success' });
            dispatch({ type: 'SIGN_UP_SUCCESS' });

            return { success: true };
          } else {
            throw new Error('Sign up failed');
          }
        } catch (err) {
          dispatch({ type: 'SIGN_UP_FAILED' });
          toast({ message: `Sign up failed` });
          return { success: false };
        }
      },
      unlink: async () => {
        try {
          await resetDatabase();
          await unsetAuth();
          toast({ message: 'Sucessfully unlinked', type: 'success' });
        } catch (err) {
          toast({ message: 'Failed to sign out' });
        }
      },
    }),
    [],
  );

  const { isLoading, refreshToken, accessToken, userId, organizationId, isSignInLoading, isSignUpLoading } = state;

  if (isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }

  return (
    <Root>
      <DatabaseProvider database={database}>
        <NavigationContainer theme={drawerTheme}>
          <AuthContext.Provider value={{ ...authContext, isSignInLoading, isSignUpLoading }}>
            {!accessToken || !refreshToken || !organizationId || !userId ? (
              <AuthNavigator />
            ) : (
              <Sync database={database} organizationId={organizationId}>
                <Main organizationId={organizationId} userId={userId} />
              </Sync>
            )}
          </AuthContext.Provider>
        </NavigationContainer>
      </DatabaseProvider>
    </Root>
  );
};

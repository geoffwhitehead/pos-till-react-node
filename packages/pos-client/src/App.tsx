import React from 'react';
import { SplashScreen } from './pages/SplashScreen/SplashScreen';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from './contexts/AuthContext';
import { Api } from './api';
import { signUp, signIn } from './api/auth';
import { AuthNavigator } from './navigators';
import { realm } from './services/Realm';
import { RealmProvider } from 'react-use-realm';
import { Main } from './pages/Main/Main';
import { NavigationContainer } from '@react-navigation/native';
import { Root } from 'native-base';

export const App = () => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.log('Restoring token failed');
      }
      Api.setHeader('Authorization', `Bearer ${userToken}`);

      // TODO: validate token with server

      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        // TODO: handle errors

        try {
          const { ok, data: token } = await signIn(data);
          if (ok) {
            Api.setHeader('Authorization', `Bearer ${token}`);
            await AsyncStorage.setItem('userToken', token);
            dispatch({ type: 'SIGN_IN', token });
          }
        } catch (err) {
          console.log('Error signing in', err);
        }
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem('userToken');
          Api.setHeader('Authorization', '');
          dispatch({ type: 'SIGN_OUT' });
        } catch (e) {
          console.log('sign out failed');
        }
      },
      signUp: async data => {
        // TODO: handle errors

        try {
          const { ok, data: token } = await signUp(data);

          if (ok) {
            Api.setHeader('Authorization', `Bearer ${token}`);
            await AsyncStorage.setItem('userToken', token);
            dispatch({ type: 'SIGN_IN', token });
          } else {
            throw new Error('Sign up failed');
          }
        } catch (err) {
          console.log('Sign up failed', err);
        }
      },
    }),
    [],
  );

  if (state.isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }

  return (
    <Root>
      <NavigationContainer>
        <AuthContext.Provider value={authContext}>
          {state.userToken == null ? (
            <AuthNavigator />
          ) : (
            <AuthContext.Provider value={authContext}>
              <RealmProvider initialRealm={realm}>
                <Main />
              </RealmProvider>
            </AuthContext.Provider>
          )}
        </AuthContext.Provider>
      </NavigationContainer>
    </Root>
  );
};

import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import Realm from 'realm'
import { NavigationContainer } from '@react-navigation/native'
// const { store, persistor } = createStore()
import { Checkout } from './pages/Checkout/Checkout'
import { SplashScreen } from './pages/SplashScreen/SplashScreen'
import { createStackNavigator } from '@react-navigation/stack'
const Stack = createStackNavigator()
import { SignUp } from './pages/SignUp/SignUp'
import { SignIn } from './pages/SignIn/SignIn'
import AsyncStorage from '@react-native-community/async-storage'
import { AuthContext } from './contexts/AuthContext'
import { create } from 'apisauce'
import { Toast } from 'native-base'

const api = create({
  baseURL: 'http://localhost:5000',
  headers: { Accept: 'application/json' },
})

export default ({ navigation }) => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          }
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          }
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          }
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  )

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken

      try {
        userToken = await AsyncStorage.getItem('userToken')
      } catch (e) {
        console.log('Restoring token failed')
      }
      api.setHeader('Authorization', userToken)

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken })
    }

    bootstrapAsync()
  }, [])

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        console.log('data', data)
        const { ok, data: token } = await api.post('/auth/login', data)
        if (ok) {
          api.setHeader('Authorization', token)
          try {
            await AsyncStorage.setItem('userToken', token)
          } catch (e) {
            console.log('Restoring token failed')
          }
          dispatch({ type: 'SIGN_IN', token })
        }
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem('userToken')
        } catch (e) {
          console.log('sign out failed')
        }
        api.setHeader('Authorization', '')
        dispatch({ type: 'SIGN_OUT' })
      },
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' })
      },
    }),
    []
  )

  if (state.isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {state.userToken == null ? (
            // No token found, user isn't signed in
            <>
              <Stack.Screen
                name="SignIn"
                component={SignIn}
                options={{
                  title: 'SignIn',
                  // When logging out, a pop animation feels intuitive
                  // You can remove this if you want the default 'push' animation
                  animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                }}
              />
              <Stack.Screen name="SignUp" component={SignUp} />
            </>
          ) : (
            // User is signed in
            <Stack.Screen name="Checkout" component={Checkout} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  )
}

// export default () => {
//   return (
//     // <Provider store={store}>
//     // <PersistGate loading={null} persistor={persistor}>
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Checkout">
//         <Stack.Screen name="Checkout" component={Checkout} />
//       </Stack.Navigator>
//     </NavigationContainer>
//     // </PersistGate>
//     // </Provider>
//   )
// }

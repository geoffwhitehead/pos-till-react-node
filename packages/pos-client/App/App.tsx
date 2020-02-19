import React from 'react'
// import { Provider } from 'react-redux'
// import { PersistGate } from 'redux-persist/lib/integration/react'
// import Realm from 'realm'
// import { NavigationContainer } from '@react-navigation/native'
// const { store, persistor } = createStore()
// import { Checkout } from './pages/Checkout/Checkout'
import { SplashScreen } from './pages/SplashScreen/SplashScreen'
// import { createStackNavigator } from '@react-navigation/stack'
// import { SignIn } from './pages/SignIn/SignIn'
import AsyncStorage from '@react-native-community/async-storage'
import { AuthContext } from './contexts/AuthContext'
// import { Toast } from 'native-base'
import { Api } from './api'
import { signUp, signIn } from './api/auth'
import { AppNavigator } from './navigators'

export default () => {
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
      Api.setHeader('Authorization', userToken)

      // TODO: validate token with server

      dispatch({ type: 'RESTORE_TOKEN', token: userToken })
    }

    bootstrapAsync()
  }, [])

  React.useEffect(() => {})

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // TODO: handle errors

        try {
          const { ok, data: token } = await signIn(data)
          if (ok) {
            Api.setHeader('Authorization', token)
            await AsyncStorage.setItem('userToken', token)
            dispatch({ type: 'SIGN_IN', token })
          }
        } catch (err) {
          console.log('Error signing in', err)
        }
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem('userToken')
          Api.setHeader('Authorization', '')
          dispatch({ type: 'SIGN_OUT' })
        } catch (e) {
          console.log('sign out failed')
        }
      },
      signUp: async (data) => {
        // TODO: handle errors

        try {
          const { ok, data: token } = await signUp(data)

          if (ok) {
            Api.setHeader('Authorization', token)
            await AsyncStorage.setItem('userToken', token)
            dispatch({ type: 'SIGN_IN', token })
          } else {
            throw new Error('Sign up failed')
          }
        } catch (err) {
          console.log('Sign up failed', err)
        }
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
      <AppNavigator token={state.userToken} />
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

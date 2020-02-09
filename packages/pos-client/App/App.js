import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import createStore from 'App/Stores'
import RootScreen from './Pages/RootScreen'
import Realm from 'realm'
import { NavigationContainer } from '@react-navigation/native'
// const { store, persistor } = createStore()
import { Dashboard } from './Pages/Dashboard/Dashboard'

import { createStackNavigator } from '@react-navigation/stack'
const Stack = createStackNavigator()

export default class App extends Component {
  // constructor(props) {
  //   super(props)
  //   this.state = { realm: null }
  // }

  // componentDidMount() {
  //   Realm.open({
  //     schema: [{ name: 'Dog', properties: { name: 'string' } }],
  //   }).then((realm) => {
  //     realm.write(() => {
  //       realm.create('Dog', { name: 'Rex' })
  //     })
  //     this.setState({ realm })
  //   })
  // }

  // componentWillUnmount() {
  //   // Close the realm if there is one open.
  //   const { realm } = this.state
  //   if (realm !== null && !realm.isClosed) {
  //     realm.close()
  //   }
  // }

  render() {
    // const info = this.state.realm
    //   ? 'Number of dogs in this Realm: ' + this.state.realm.objects('Dog').length
    //   : 'Loading...'

    // console.log('INFO ', info)

    /** * @see https://github.com/reduxjs/react-redux/blob/master/docs/api/Provider.md */

    {
      /**
       * PersistGate delays the rendering of the app's UI until the persisted state has been retrieved
       * and saved to redux.
       * The `loading` prop can be `null` or any react instance to show during loading (e.g. a splash screen),
       * for example `loading={<SplashScreen />}`.
       * @see https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md
       */
    }
    return (
      // <Provider store={store}>
      // <PersistGate loading={null} persistor={persistor}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Dashboard">
          <Stack.Screen name="Dashboard" component={Dashboard} />
        </Stack.Navigator>
      </NavigationContainer>

      // {/* <RootScreen realm={this.state.realm} /> */}
      // </PersistGate>
      // </Provider>
    )
  }
}

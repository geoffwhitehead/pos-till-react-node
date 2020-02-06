import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import createStore from 'App/Stores'
import RootScreen from './Containers/Root/RootScreen'
import Realm from 'realm'

const { store, persistor } = createStore()

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = { realm: null }
  }

  componentDidMount() {
    Realm.open({
      schema: [{ name: 'Dog', properties: { name: 'string' } }],
    }).then((realm) => {
      realm.write(() => {
        realm.create('Dog', { name: 'Rex' })
      })
      this.setState({ realm })
    })
  }

  componentWillUnmount() {
    // Close the realm if there is one open.
    const { realm } = this.state
    if (realm !== null && !realm.isClosed) {
      realm.close()
    }
  }

  render() {
    const info = this.state.realm
      ? 'Number of dogs in this Realm: ' + this.state.realm.objects('Dog').length
      : 'Loading...'

    console.log('INFO ', info)
    return (
      /**
       * @see https://github.com/reduxjs/react-redux/blob/master/docs/api/Provider.md
       */
      <Provider store={store}>
        {/**
         * PersistGate delays the rendering of the app's UI until the persisted state has been retrieved
         * and saved to redux.
         * The `loading` prop can be `null` or any react instance to show during loading (e.g. a splash screen),
         * for example `loading={<SplashScreen />}`.
         * @see https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md
         */}
        <PersistGate loading={null} persistor={persistor}>
          <RootScreen realm={this.state.realm} />
        </PersistGate>
      </Provider>
    )
  }
}

import React from 'react'
import { Platform, View, ActivityIndicator, Image } from 'react-native'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import ExampleActions from 'App/Stores/Example/Actions'
import { liveInEurope } from 'App/Stores/Example/Selectors'
import Style from './ExampleScreenStyle'
import { ApplicationStyles, Helpers, Images, Metrics } from 'App/Theme'
import { Container, Button, Text } from 'native-base'
import Realm from 'realm'
/**
 * This is an example of a container component.
 *
 * This screen displays a little help message and informations about a fake user.
 * Feel free to remove it.
 */

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\nCmd+D or shake for dev menu.',
  android: 'Double tap R on your keyboard to reload,\nShake or press menu button for dev menu.',
})

class ExampleScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = { realm: null }
  }

  componentDidMount() {
    // this._fetchUser()
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
    // const [x, setX] = useState(true)

    const info = this.state.realm
      ? 'Number of dogs in this Realm: ' + this.state.realm.objects('Dog').length
      : 'Loading...'

    console.log('!!!!!! ', info)
    return (
      <View
        style={[
          Helpers.fill,
          Helpers.rowMain,
          Metrics.mediumHorizontalMargin,
          Metrics.mediumVerticalMargin,
        ]}
      >
        {this.props.userIsLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View>
            <Container>
              <Button>
                <Text>Button</Text>
              </Button>
            </Container>
          </View>
        )}
      </View>
    )
  }

  _fetchUser() {
    this.props.fetchUser()
  }
}

ExampleScreen.propTypes = {
  user: PropTypes.object,
  userIsLoading: PropTypes.bool,
  userErrorMessage: PropTypes.string,
  fetchUser: PropTypes.func,
  liveInEurope: PropTypes.bool,
}

const mapStateToProps = (state) => ({
  user: state.example.user,
  userIsLoading: state.example.userIsLoading,
  userErrorMessage: state.example.userErrorMessage,
  liveInEurope: liveInEurope(state),
})

const mapDispatchToProps = (dispatch) => ({
  fetchUser: () => dispatch(ExampleActions.fetchUser()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExampleScreen)

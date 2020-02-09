import React, { useState, useEffect } from 'react'
import { Platform, View, ActivityIndicator, Image } from 'react-native'
import { connect } from 'react-redux'
import ExampleActions from '../../Stores/Example/Actions'
import { liveInEurope } from '../../Stores/Example/Selectors'
import Style from './Dashboard.styles'
import { ApplicationStyles, Helpers, Images, Metrics } from '../../Theme'
import { Container, Button, Text } from 'native-base'
import Realm from 'realm'
import { useRealm } from '../../Hooks/useRealm'
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

const realm = new Realm({
  schema: [{ name: 'Dog', properties: { name: 'string' } }],
})
const query = () => realm.objects('Dog')

function useRealmResultsHook(query) {
  const [data, setData] = useState(query())

  useEffect(
    () => {
      function handleChange(newData) {
        // Not working even that data !== newData
        console.warn(data === newData)
        setData(newData)
        // With [...newData] works
        // setData(newData);
      }
      const dataQuery = query()
      dataQuery.addListener(handleChange)
      return () => {
        dataQuery.removeAllListeners()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query]
  )

  return data
}

export const Dashboard: React.SFC<{}> = () => {
  // const realm = useRealm()
  const dogs = useRealmResultsHook(query)
  console.log('INFO ', realm)
  return (
    <View
      style={[
        Helpers.fill,
        Helpers.rowMain,
        Metrics.mediumHorizontalMargin,
        Metrics.mediumVerticalMargin,
      ]}
    >
      <View>
        <Container>
          <Text>{`Dogs: ${dogs.length}`}</Text>
          <Button
            onPress={() => {
              realm.write(() => {
                realm.create('Dog', { name: 'Rex' })
              })
            }}
          />
        </Container>
      </View>

      {/* {this.props.userIsLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        
      )} */}
    </View>
  )
}
// class ExampleScreen extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = { realm: null }
//   }

//   // componentDidMount() {
//   //   // this._fetchUser()
//   //   Realm.open({
//   //     schema: [{ name: 'Dog', properties: { name: 'string' } }],
//   //   }).then((realm) => {
//   //     realm.write(() => {
//   //       realm.create('Dog', { name: 'Rex' })
//   //     })
//   //     this.setState({ realm })
//   //   })
//   // }

//   // componentWillUnmount() {
//   //   // Close the realm if there is one open.
//   //   const { realm } = this.state
//   //   if (realm !== null && !realm.isClosed) {
//   //     realm.close()
//   //   }
//   // }

//   render() {
//     // const [x, setX] = useState(true)

//     const info = this.state.realm
//       ? 'Number of dogs in this Realm: ' + this.state.realm.objects('Dog').length
//       : 'Loading...'

//     console.log('!!!!!! ', info)
//     return (
//       <View
//         style={[
//           Helpers.fill,
//           Helpers.rowMain,
//           Metrics.mediumHorizontalMargin,
//           Metrics.mediumVerticalMargin,
//         ]}
//       >
//         {this.props.userIsLoading ? (
//           <ActivityIndicator size="large" color="#0000ff" />
//         ) : (
//           <View>
//             <Container>
//               <Button>
//                 <Text>Button</Text>
//               </Button>
//             </Container>
//           </View>
//         )}
//       </View>
//     )
//   }

//   _fetchUser() {
//     this.props.fetchUser()
//   }
// }

// ExampleScreen.propTypes = {
//   user: PropTypes.object,
//   userIsLoading: PropTypes.bool,
//   userErrorMessage: PropTypes.string,
//   fetchUser: PropTypes.func,
//   liveInEurope: PropTypes.bool,
// }

// const mapStateToProps = (state) => ({
//   user: state.example.user,
//   userIsLoading: state.example.userIsLoading,
//   userErrorMessage: state.example.userErrorMessage,
//   liveInEurope: liveInEurope(state),
// })

// const mapDispatchToProps = (dispatch) => ({
//   fetchUser: () => dispatch(ExampleActions.fetchUser()),
// })

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(ExampleScreen)

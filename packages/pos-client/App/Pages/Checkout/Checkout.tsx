import React, { useContext, Component } from 'react'
import { Platform, View, ActivityIndicator, Image } from 'react-native'
import { Helpers, Metrics } from '../../theme'
import { Container, Button, Text, Header, Drawer } from '../../core'
import { useRealmQuery } from '../../hooks/useRealm'
import { realm } from '../../services/Realm'
import { AuthContext } from '../../contexts/AuthContext'
import { Sidebar } from '../../components/Sidebar/Sidebar'
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader'
import { useNavigation } from '@react-navigation/native'
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\nCmd+D or shake for dev menu.',
  android: 'Double tap R on your keyboard to reload,\nShake or press menu button for dev menu.',
})

const query = () => realm.objects('Dog')

// class Checkout extends Component {
//   closeDrawer = () => {
//     this.drawer._root.close()
//   }
//   openDrawer = () => {
//     this.drawer._root.open()
//   }
//   render() {
//     const dogs = useRealmQuery(query)
//     return (
//       <Drawer
//         ref={(ref) => {
//           this.drawer = ref
//         }}
//         content={<Sidebar />}
//         onClose={() => this.closeDrawer()}
//       >

//         <Text>{`Dogs: ${dogs.length}`}</Text>
//         <Button
//           onPress={() => {
//             realm.write(() => {
//               realm.create('Dog', { name: 'Rex' })
//             })
//           }}
//         >
//           <Text>Add</Text>
//         </Button>
//       </Drawer>
//     )
//   }
// }

// export { Checkout }
export const Checkout = ({ navigation }) => {
  const dogs = useRealmQuery(query)
  // const openSidebar = this.openDrawer.bind(this)
  // closeDrawer = () => {
  //   this.drawer._root.close()
  // };
  // openDrawer = () => {
  //   this.drawer._root.open()
  // };

  console.log('navigation', navigation)
  return (
    <Container>
      <SidebarHeader title="Checkout" onOpen={navigation.toggleDrawer()} />

      {/* <Sidebar navigation={navigation}>
      </Sidebar> */}
        <Text>BLA</Text>
      {/* </Sidebar> */}
    </Container>
  )
  // return (
  //   <Container>
  //     <Sidebar>
  //       {({ openDrawer }) => {
  //         console.log('props', openDrawer)
  //         return (
  //           <>
  //             {/* <SidebarHeader title="Checkout" onOpen={openDrawer} /> */}

  //             <Text>{`Dogs: ${dogs.length}`}</Text>
  //             <Button
  //               onPress={() => {
  //                 realm.write(() => {
  //                   realm.create('Dog', { name: 'Rex' })
  //                 })
  //               }}
  //             >
  //               <Text>Add</Text>
  //             </Button>
  //           </>
  //         )
  //       }}
  //     </Sidebar>
  //   </Container>
  // )
}

// style={[
//   Helpers.fill,
//   Helpers.rowMain,
//   Metrics.mediumHorizontalMargin,
//   Metrics.mediumVerticalMargin,
// ]}
{
  /* <SidebarHeader title="Checkout" onOpen={() => {}}/> */
}

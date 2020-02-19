import React, { useContext, Component } from 'react'
import { Button, Text, Content, List, ListItem, Drawer } from '../../core'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { AuthContext } from '../../contexts/AuthContext'
import { Checkout } from '../../pages/Checkout/Checkout'
import { SidebarHeader } from '../SidebarHeader/SidebarHeader'

// interface SidebarContentProps {
//   navigator: Navigator;
// }

// import React, { Component } from 'react';

const routes = ['Checkout', 'SplashScreen']

export const Sidebar = ({ navigation }) => {
  const Drawer = createDrawerNavigator()
  const { signOut } = useContext(AuthContext)

  // return (
  //   <>
  //     <Drawer.Navigator initialRouteName="Checkout">
  //       <Drawer.Screen name="Checkout" component={Checkout} />
  //     </Drawer.Navigator>
  //     <Button onPress={() => signOut()}>
  //       <Text>Sign out</Text>
  //     </Button>
  //   </>
  // )
  return (
    <Content>
      <List
        dataArray={routes}
        renderRow={(route) => {
          return (
            <ListItem button onPress={() => navigation.navigate(route)}>
              <Text>{route}</Text>
            </ListItem>
          )
        }}
      />
    </Content>
  )
}

// export class Sidebar extends Component {
//   closeDrawer = () => {
//     this.drawer._root.close()
//   }

//   openDrawer = () => {
//     this.drawer._root.open()
//   }
//   render() {
//     console.log('this.props', this.props)
//     return (
//       <Drawer
//         ref={(ref) => {
//           this.drawer = ref
//         }}
//         content={<SidebarContent />}
//         onClose={this.closeDrawer}
//       >
//         {this.props.children({ openDrawer: this.openDrawer.bind(this) })}
//         {/* <> */}

//         {/* {React.cloneElement(this.children, { openDrawer: this.openDrawer.bind(this) })} */}
//         {/* </> */}
//       </Drawer>
//     )
//   }
// }

// const ComponentName: React.FC = () => {
//   return (

//   );
// };

// export default ComponentName

// render() {
//   return (
//     <>
//       <Text>SIDEBAR</Text>
//       <Drawer
//         ref={(ref) => {
//           this.drawer = ref
//         }}
//         content={<SidebarContent navigator={this.navigator} />}
//         onClose={onSidebarClose}
//       >
//         {this.children}
//       </Drawer>
//     </>
//   )
// }
// export const Sidebar: React.FC<{}> = ({ children }) => {

// }

// export const SidebarContent: React.SFC = ({ navigator }) => {
//   const Drawer = createDrawerNavigator()
//   const { signOut } = useContext(AuthContext)

//   return (
//     <>
//       <Drawer.Navigator initialRouteName="Checkout">
//         <Drawer.Screen name="Checkout" component={Checkout} />
//       </Drawer.Navigator>
//       <Button onPress={() => signOut()}>
//         <Text>Sign out</Text>
//       </Button>
//     </>
//   )
// }

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

const query = () => realm.objects('Item')

export const Checkout = ({ navigation }) => {
  const items = useRealmQuery(query)
  console.log('navigation', navigation)
  return (
    <Container>
      <SidebarHeader title="Checkout" onOpen={navigation.toggleDrawer()} />
      <Text>{`Items: ${items.length}`}</Text>
    </Container>
  )
}

// <Button
//   onPress={() => {
//     realm.write(() => {
//       realm.create('Item', { name: 'Rex' })
//     })
//   }}
// >
//   <Text>Add</Text>
// </Button> */}

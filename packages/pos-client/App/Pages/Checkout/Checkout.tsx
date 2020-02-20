import React from 'react'
import { Platform } from 'react-native'
import { Container, Button, Text, Header, Drawer, Content } from '../../core'
import { useRealmQuery } from '../../hooks/useRealm'
import { realm } from '../../services/Realm'
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\nCmd+D or shake for dev menu.',
  android: 'Double tap R on your keyboard to reload,\nShake or press menu button for dev menu.',
})

const query = () => realm.objects('Item')

export const Checkout = ({ navigation }) => {
  const items = useRealmQuery(query)
  return (
    <Container>
      <SidebarHeader title="Checkout" onOpen={navigation.toggleDrawer()} />
      <Content>
        <Text>{`Items: ${items.length}`}</Text>
        <Text>{instructions}</Text>
      </Content>
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

import React, { useState } from 'react'
import { Platform } from 'react-native'
import { Container, Button, Text, Header, Drawer, Content } from '../../core'
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader'
import { populate } from '../../services/populate'
import { Loading } from '../Loading/Loading'
import { useRealmQuery } from 'react-use-realm'
import { ItemSchema } from '../../services/schemas'
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\nCmd+D or shake for dev menu.',
  android: 'Double tap R on your keyboard to reload,\nShake or press menu button for dev menu.',
})

export const Checkout = ({ navigation }) => {
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    const populateAsync = async () => {
      // TODO: use the dataId property to validate whether we need to re populate.
      try {
        await populate()
        setLoading(false)
      } catch (err) {
        console.log('Populating failed', err)
      }
    }
    populateAsync()
  }, [])

  const items = useRealmQuery({ source: ItemSchema.name })
  console.log('items', items)
  return loading ? (
    <Loading />
  ) : (
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

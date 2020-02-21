import React, { useState } from 'react'
import { Platform } from 'react-native'
import { Container, Button, Text, Header, Drawer, Content, Grid, Col } from '../../core'
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader'
import { populate } from '../../services/populate'
import { Loading } from '../Loading/Loading'
import { useRealmQuery } from 'react-use-realm'
import { ItemSchema, BillRegister } from '../../services/schemas'
import { CheckoutItemNavigator } from '../../navigators/CheckoutItemNavigator'
import { Receipt } from './sub-components/Receipt/Receipt'
import { CheckoutPaymentNavigator } from '../../navigators/CheckoutPaymentNavigator'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\nCmd+D or shake for dev menu.',
  android: 'Double tap R on your keyboard to reload,\nShake or press menu button for dev menu.',
})

export const Checkout = ({ navigation }) => {
  const items = useRealmQuery({ source: ItemSchema.name })
  const bill = useRealmQuery({ source: BillRegister.name })
  const billRegister = bill[0]
  console.log('items', items)
  console.log('bill', bill)
  console.log('billRegister', billRegister)

  if (!billRegister) {
    return <Text>Error no register</Text>
  }
  return (
    <Container>
      <SidebarHeader title="Checkout" onOpen={navigation.openDrawer()} />
      <Grid>
        <Col style={{ backgroundColor: '#635DB7' }}>
          {billRegister.activeBill ? <CheckoutItemNavigator /> : <Text>Select Bill </Text>}
        </Col>
        <Col style={{ backgroundColor: '#00CE9F', width: 350 }}>
          <CheckoutPaymentNavigator billRegister={billRegister} />
        </Col>
      </Grid>
    </Container>
  )
}

{
  /* <Content>
        <Text>{`Items: ${items.length}`}</Text>
        <Text>{instructions}</Text>
      </Content> */
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

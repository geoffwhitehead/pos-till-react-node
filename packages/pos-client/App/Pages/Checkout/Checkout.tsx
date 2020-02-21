import React, { useState } from 'react'
import { Platform } from 'react-native'
import { Container, Button, Text, Header, Drawer, Content, Grid, Col } from '../../core'
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader'
import { populate } from '../../services/populate'
import { Loading } from '../Loading/Loading'
import { useRealmQuery } from 'react-use-realm'
import { ItemSchema, BillSchema } from '../../services/schemas'
import { CheckoutItemNavigator } from '../../navigators/CheckoutItemNavigator'
import { Receipt } from './sub-components/Receipt/Receipt'
import { CheckoutPaymentNavigator } from '../../navigators/CheckoutPaymentNavigator'
import { SelectBill } from './sub-components/SelectBill/SelectBIll'
import { realm } from '../../services/Realm'
import uuidv4 from 'uuid'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\nCmd+D or shake for dev menu.',
  android: 'Double tap R on your keyboard to reload,\nShake or press menu button for dev menu.',
})

export const Checkout = ({ navigation }) => {
  const openBills = useRealmQuery({ source: BillSchema.name, filter: `isClosed = false` })
  const [activeBill, setActiveBill] = useState(null)

  const onSelectBill = (tab, bill) => {
    console.log(' --- bill', bill)
    console.log('tab', tab)
    if (bill) {
      setActiveBill(bill)
    } else {
      let b
      realm.write(() => {
        b = realm.create(BillSchema.name, { _id: uuidv4(), tab })
      })
      setActiveBill(b)
    }
  }

  const clearBill = () => setActiveBill(null)
  const openDrawer = () => navigation.openDrawer()

  return !openBills ? (
    <Loading />
  ) : (
    <Container>
      <SidebarHeader title="Checkout" onOpen={openDrawer} />
      <Grid>
        <Col>
          {activeBill ? (
            <CheckoutItemNavigator activeBill={activeBill} />
          ) : (
            <SelectBill maxBills={40} openBills={openBills} onSelectBill={onSelectBill} />
          )}
        </Col>
        <Col style={{ border: '1px solid grey', width: 350 }}>
          <Receipt activeBill={activeBill} onSelectBill={clearBill} />
        </Col>
      </Grid>
    </Container>
  )
}

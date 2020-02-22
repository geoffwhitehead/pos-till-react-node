import React from 'react'
import { Text, Container } from '../../core'
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader'

export const Transactions = ({ navigation }) => {
  return (
    <Container>
      <SidebarHeader title="Transactions" onOpen={navigation.toggleDrawer()} />
      <Text>WIP Transactions</Text>
    </Container>
  )
}

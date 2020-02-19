import React from 'react'
import { Text, Container } from '../../core'
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader'

export const Bills = ({ navigation }) => {
  return (
    <Container>
      <SidebarHeader title="Bills" onOpen={navigation.toggleDrawer()} />
      <Text>WIP Bills</Text>
    </Container>
  )
}

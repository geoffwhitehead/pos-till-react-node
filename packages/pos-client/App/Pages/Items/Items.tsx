import React from 'react'
import { Text, Content, List, ListItem, Container } from '../../core'
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader'

export const Items = ({ navigation }) => {
  return (
    <Container>
      <SidebarHeader title="Items" onOpen={navigation.toggleDrawer()} />
      <Content>
        <List>
          <ListItem itemHeader first>
            <Text>WIP Items</Text>
          </ListItem>
        </List>
      </Content>
    </Container>
  )
}

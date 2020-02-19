import React from 'react'
import { Text, Content, List, ListItem } from '../../core'

export const Items: React.FC = () => {
  return (
    <Content>
      <List>
        <ListItem itemHeader first>
          <Text>COMEDY</Text>
        </ListItem>
      </List>
    </Content>
  )
}

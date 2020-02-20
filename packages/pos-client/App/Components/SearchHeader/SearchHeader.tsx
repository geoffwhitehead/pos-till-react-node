import React from 'react'
import { Container, Item, Icon, Input, Button, Header, Text } from '../../core'

export const SearchHeader: React.FC = () => {
  return (
    <Container>
      <Header searchBar rounded>
        <Item>
          <Icon name="ios-search" />
          <Input placeholder="Search" />
        </Item>
        <Button transparent>
          <Text>Search</Text>
        </Button>
      </Header>
    </Container>
  )
}

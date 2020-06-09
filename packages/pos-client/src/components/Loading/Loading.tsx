import React from 'react'
import { Container, Content, Header, Spinner, Text } from '../../core'


// TODO: update this
export const Loading: React.FC = () => {
  return (
    <Container>
      <Header />
      <Content>
        <Spinner />
        <Text>Loading ... </Text>
      </Content>
    </Container>
  )
}

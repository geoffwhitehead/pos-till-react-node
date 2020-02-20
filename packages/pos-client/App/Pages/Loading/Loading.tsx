import React from 'react'
import { Container, Content, Header, Spinner, Text } from '../../core'

export const Loading: React.FC = () => {
  return (
    <Container>
      <Header />
      <Content>
        <Spinner />
        <Text>One sec, we're just fetching the latest product data</Text>
      </Content>
    </Container>
  )
}

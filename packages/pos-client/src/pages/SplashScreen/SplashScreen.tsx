import React from 'react'
import { Container, Content, Header, Spinner, Text } from '../../core'

export const SplashScreen: React.FC = () => {
  return (
    <Container>
      <Header />
      <Content>
        <Spinner />
        <Text>[Insert company logo]</Text>

        <Text>Hi, just a sec</Text>
      </Content>
    </Container>
  )
}

import React from 'react';
import { Container, Content, Header, Spinner, Text } from '../../core';

export const SplashScreen: React.FC = () => {
  return (
    <Container>
      <Header />
      <Content>
        <Spinner />
        <Text>[logo]</Text>

        <Text>Complete splash screen</Text>
      </Content>
    </Container>
  );
};

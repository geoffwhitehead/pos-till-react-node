import React from 'react';
import { Container, Spinner, Text } from '../../core';

export const SplashScreen: React.FC = () => {
  return (
    <Container>
      <Spinner />
      <Text>[logo]</Text>

      <Text>Complete splash screen</Text>
    </Container>
  );
};

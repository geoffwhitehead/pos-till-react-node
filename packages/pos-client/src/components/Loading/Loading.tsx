import React from 'react';
import { Container, Header, Spinner, Text } from '../../core';

// TODO: update this
export const Loading: React.FC = () => {
  return (
    <Container>
      <Header />
      <Spinner />
      <Text>Loading ... </Text>
    </Container>
  );
};

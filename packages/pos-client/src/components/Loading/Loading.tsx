import LottieView from 'lottie-react-native';
import React from 'react';
import { Container } from '../../core';

export const Loading: React.FC = () => {
  return (
    <Container style={{}}>
      <LottieView
        style={{ height: 400, width: 600, alignSelf: 'center' }}
        source={require('../../animations/201-simple-loader.json')}
        autoPlay={true}
        loop={true}
      />
    </Container>
  );
};

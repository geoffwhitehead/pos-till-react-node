import { map } from 'lodash';
import { StyleSheet } from 'react-native';
import { scale } from '../utils/scaling';

const size = {
  h1: scale(40),
  h2: scale(35),
  h3: scale(30),
  input: scale(18),
  regular: scale(17),
  medium: scale(14),
  small: scale(12),
};

export const fonts = StyleSheet.create({
  h1: {
    fontSize: size.h1,
  },
  h2: {
    fontSize: size.h2,
  },
  h3: {
    fontSize: size.h3,
  },
  normal: {
    fontSize: size.regular,
  },
  small: {},
});

const sizes = [8, 12, 16, 20, 24, 28, 32];

export const fontSizes = map(sizes, scale);

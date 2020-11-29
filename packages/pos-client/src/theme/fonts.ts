import { map } from 'lodash';
import { StyleSheet } from 'react-native';
import { moderateScale } from '../utils/scaling';

const size = {
  h1: moderateScale(40),
  h2: moderateScale(35),
  h3: moderateScale(30),
  input: moderateScale(18),
  regular: moderateScale(17),
  medium: moderateScale(14),
  small: moderateScale(12),
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

export const fontSizes = map(sizes, moderateScale);

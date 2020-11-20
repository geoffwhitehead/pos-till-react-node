import { StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../../theme';

export default StyleSheet.create({
  error: {
    ...fonts.normal,
    color: colors.error,
    marginBottom: spacing.tiny,
    textAlign: 'center',
  },
  instructions: {
    ...fonts.normal,
    fontStyle: 'italic',
    marginBottom: spacing.tiny,
    textAlign: 'center',
  },
  logoContainer: {
    height: 300,
    marginBottom: 25,
  },
  result: {
    ...fonts.normal,
    marginBottom: spacing.tiny,
    textAlign: 'center',
  },
  text: {
    ...fonts.normal,
    marginBottom: spacing.tiny,
    textAlign: 'center',
  },
});

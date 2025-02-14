import { StyleSheet } from 'react-native';
import { moderateScale } from '../../../utils/scaling';

export const commonStyles = StyleSheet.create({
  heading: {
    marginTop: 40,
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'space-between',
  },
  text: {
    margin: 10,
    marginTop: 20,
    marginBottom: 2,
    textAlign: 'left',
  },
  content: { padding: 15, width: moderateScale(500) },
  form: { width: 400 },
  selectedRow: { backgroundColor: '#cde1f9' },
  indent: {
    marginLeft: 30,
  },
  container: {
    margin: 30,
  },
  column: {
    marginLeft: 20,
    marginRight: 20,
  },
  button: {
    margin: 3,
  },
  row: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 10,
    marginBottom: 10,
  },
});

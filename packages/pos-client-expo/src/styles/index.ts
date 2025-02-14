import { StyleSheet } from 'react-native';
import { moderateScale } from '../utils/scaling';

export const styles = StyleSheet.create({
  heading: {
    marginBottom: moderateScale(20),
  },
  text: {
    paddingTop: moderateScale(20),
    paddingBottom: moderateScale(5),
  },
  form: { width: moderateScale(400), margin: moderateScale(30) },
  selectedRow: { backgroundColor: '#cde1f9' },
  modal: {
    borderRadius: 5,
    backgroundColor: 'white',
    // width: 400,
    padding: moderateScale(30),
  },
  indent: {
    marginLeft: moderateScale(30),
  },
  container: {
    margin: moderateScale(30),
  },
  columnLeft: {
    marginRight: moderateScale(20),
  },
  columnRight: {
    marginLeft: moderateScale(20),
  },
  button: {
    margin: 3,
  },
  row: {
    marginTop: moderateScale(10),
    marginBottom: moderateScale(10),
  },
} as const);

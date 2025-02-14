import { ErrorMessage as FormikErrorMessage } from 'formik';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from '../../core';

type ErrorMessageProps = {
  style?: object
  name: string;
  children?: React.ReactNode;
} & React.ComponentProps<typeof Text>;

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ name, style, children, ...props }) => {
  return (
    <Text note style={{ ...styles.error, ...style }} {...props}>
      {children || <FormikErrorMessage name={name} />}
    </Text>
  );
};

const styles = StyleSheet.create({
  error: { paddingLeft: 15, paddingRight: 15, color: 'red' },
});

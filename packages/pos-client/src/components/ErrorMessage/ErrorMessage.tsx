import { ErrorMessage as FormikErrorMessage } from 'formik';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from '../../core';

type ErrorMessageProps = {
  style?: Record<string, any>;
  name: string;
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ name, children, style, ...props }) => {
  return (
    <Text note style={{ ...styles.error, ...style }} {...props}>
      <FormikErrorMessage name={name} />
    </Text>
  );
};

const styles = StyleSheet.create({
  error: { paddingLeft: 15, paddingRight: 15, paddingTop: 5, paddingBottom: 5, color: 'red' },
});

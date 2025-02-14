import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from '../../core';
import { paddingHelper } from '../../utils/helpers';

type FormInputDescriptionProps = {
  description: string;
  style?: object;
  children?: React.ReactNode;
} & React.ComponentProps<typeof Text>;

export const FormInputDescription: React.FC<FormInputDescriptionProps> = ({ style, description, children, ...props }) => {
  return (
    <Text note style={{ ...styles.text, ...(style || {}) }} {...props}>
      {children || description}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    ...paddingHelper(10, 0, 10, 10),
  },
});

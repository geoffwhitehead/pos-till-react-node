import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from '../../core';
import { paddingHelper } from '../../utils/helpers';

type FormInputDescriptionProps = {
  description: string;
  style: {};
};

export const FormInputDescription: React.FC<FormInputDescriptionProps> = ({ style, description }) => {
  return (
    <Text note style={{ ...styles.text, ...style }}>
      {description}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    ...paddingHelper(10, 0, 10, 10),
  },
});

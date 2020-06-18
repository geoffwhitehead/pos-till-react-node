import React from 'react';
import { styles } from '../../styles';
import { Content, Text, Button, H3 } from '../../core';
import { View } from 'react-native';

interface ModalContentButtonProps {
  title: string,
  onPressButton: () => void,
  buttonText: string
  disabled: boolean
}

export const ModalContentButton: React.FC<ModalContentButtonProps> = ({ children, disabled, title, onPressButton, buttonText }) => {
  return (
    <Content style={cStyles.modal}>
      <View style={cStyles.heading}>
        <H3>{title}</H3>
        <Button disabled={disabled} onPress={onPressButton}>
          <Text>{buttonText}</Text>
        </Button>
      </View>
      <Content style={cStyles.content}>{children}</Content>
    </Content>
  );
};

const cStyles = {
  heading: {
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'lightgrey',
    borderBottom: 'grey',
    borderBottomWidth: 1
  },
  content: {
    padding: 20,
  },
  modal: {
    backgroundColor: 'white',

    borderRadius: 2,
  }
};

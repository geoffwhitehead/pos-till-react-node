import React from 'react';
import { styles } from '../../styles';
import { Content, Text, Button, H3 } from '../../core';
import { View } from 'react-native';

interface ModalContentButtonProps {
  title: string;
  onPressPrimaryButton: () => void;
  onPressSecondaryButton: () => void;
  primaryButtonText: string;
  secondaryButtonText: string;
  isPrimaryDisabled?: boolean;
  isSecondaryDisabled?: boolean;
}

export const ModalContentButton: React.FC<ModalContentButtonProps> = ({
  children,
  isPrimaryDisabled,
  isSecondaryDisabled,
  title,
  onPressPrimaryButton,
  onPressSecondaryButton,
  primaryButtonText,
  secondaryButtonText,
}) => {
  return (
    <Content style={cStyles.modal}>
      <View style={cStyles.heading}>
        <H3>{title}</H3>
        <View style={cStyles.buttons}>
          <Button style={cStyles.button} light disabled={isSecondaryDisabled} onPress={onPressSecondaryButton}>
            <Text>{secondaryButtonText}</Text>
          </Button>
          <Button success disabled={isPrimaryDisabled} onPress={onPressPrimaryButton}>
            <Text>{primaryButtonText}</Text>
          </Button>
        </View>
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
    borderBottomWidth: 1,
  },
  content: {
    padding: 20,
  },
  modal: {
    backgroundColor: 'white',

    borderRadius: 2,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  button: {
    marginRight: 10,
  },
};

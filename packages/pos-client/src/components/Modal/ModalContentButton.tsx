import React from 'react';
import { styles } from '../../styles';
import { Content, Text, Button, H3, Icon } from '../../core';
import { View } from 'react-native';

interface ModalContentButtonProps {
  title: string;
  onPressPrimaryButton: () => void;
  onPressSecondaryButton: () => void;
  primaryButtonText: string;
  secondaryButtonText: string;
  isPrimaryDisabled?: boolean;
  isSecondaryDisabled?: boolean;
  onPressDelete?: () => void;
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
  onPressDelete,
}) => {
  return (
    <Content style={cStyles.modal}>
      <View style={cStyles.heading}>
        <H3>{title}</H3>
        <View style={cStyles.buttons}>
          <Button light disabled={isSecondaryDisabled} onPress={onPressSecondaryButton}>
            <Text>{secondaryButtonText}</Text>
          </Button>
          <Button success style={cStyles.buttonSpacingLeft} disabled={isPrimaryDisabled} onPress={onPressPrimaryButton}>
            <Text>{primaryButtonText}</Text>
          </Button>
          {onPressDelete && (
            <Button style={cStyles.buttonSpacingLeft} danger onPress={onPressDelete}>
              <Icon name="ios-trash" />
            </Button>
          )}
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
    padding: 30,
  },
  modal: {
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 5,
      width: 5,
    },
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  buttonSpacingLeft: {
    marginLeft: 10,
  },
};

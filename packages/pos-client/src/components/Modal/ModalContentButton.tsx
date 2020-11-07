import React from 'react';
import { View } from 'react-native';
import { Button, Content, H3, Icon, Text } from '../../core';

interface ModalContentButtonProps {
  title: string;
  onPressPrimaryButton: () => void;
  onPressSecondaryButton: () => void;
  primaryButtonText: string;
  secondaryButtonText: string;
  isPrimaryDisabled?: boolean;
  isSecondaryDisabled?: boolean;
  isDeleteDisabled?: boolean;
  onPressDelete?: () => void;
  style?: Record<string, any>;
}

export const ModalContentButton: React.FC<ModalContentButtonProps> = ({
  children,
  isPrimaryDisabled,
  isSecondaryDisabled,
  isDeleteDisabled,
  title,
  onPressPrimaryButton,
  onPressSecondaryButton,
  primaryButtonText,
  secondaryButtonText,
  onPressDelete,
  style = {},
}) => {
  return (
    <View style={{ ...cStyles.modal, ...style }}>
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
            <Button style={cStyles.buttonSpacingLeft} danger disabled={isDeleteDisabled} onPress={onPressDelete}>
              <Icon name="ios-trash" />
            </Button>
          )}
        </View>
      </View>
      <Content style={cStyles.content}>{children}</Content>
    </View>
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
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 2,
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
} as const;

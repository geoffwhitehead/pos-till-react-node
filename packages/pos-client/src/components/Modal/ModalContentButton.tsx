import React from 'react';
import { View } from 'react-native';
import { Button, Container, H3, Icon, Text } from '../../core';
import { colors } from '../../theme';
import { moderateScale } from '../../utils/scaling';

enum ModalSizes {
  small = 500,
  medium = 800,
  large = 1000,
}

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
  size?: 'small' | 'medium' | 'large';
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
  style,
  size,
  ...props
}) => {
  const width = size ? ModalSizes[size] : 'auto';

  return (
    <View {...props} style={{ ...styles.modal, ...style, width }}>
      <View style={styles.heading}>
        <H3 style={{ color: 'white' }}>{title}</H3>
        <View style={styles.buttons}>
          <Button light disabled={isSecondaryDisabled} onPress={onPressSecondaryButton}>
            <Text>{secondaryButtonText}</Text>
          </Button>
          <Button success style={styles.buttonSpacingLeft} disabled={isPrimaryDisabled} onPress={onPressPrimaryButton}>
            <Text>{primaryButtonText}</Text>
          </Button>
          {onPressDelete && (
            <Button style={styles.buttonSpacingLeft} danger disabled={isDeleteDisabled} onPress={onPressDelete}>
              <Icon name="ios-trash" />
            </Button>
          )}
        </View>
      </View>
      <Container style={styles.content}>{children}</Container>
    </View>
  );
};

const styles = {
  heading: {
    marginBottom: moderateScale(20),
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(12),
    paddingLeft: moderateScale(20),
    paddingRight: moderateScale(20),
    backgroundColor: colors.darkBlue,
    borderBottom: 'grey',
    borderBottomWidth: 1,
    color: 'white',
  },
  content: {
    padding: moderateScale(30),
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
    marginLeft: moderateScale(10),
  },
} as const;

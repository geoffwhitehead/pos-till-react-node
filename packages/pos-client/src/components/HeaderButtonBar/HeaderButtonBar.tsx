import React from 'react';
import { Button, Header, Left, ListItem, Right, Text, View } from '../../core';

export type HeaderButtonBarProps = {
  onPressPrimary: () => void;
  primaryText: string;
};
export const HeaderButtonBar: React.FC<HeaderButtonBarProps> = ({ onPressPrimary, primaryText }) => {
  return (
    <View
      style={{
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1,
        padding: 10,
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: 'row',
      }}
    >
      <Button style={{ width: 'auto' }} small success onPress={onPressPrimary}>
        <Text>{primaryText}</Text>
      </Button>
    </View>
  );
};

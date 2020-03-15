import React, { useState } from 'react';
import { Content, Label, Input, Item, Icon } from '../../core';
import { StyleSheet, View } from 'react-native';

const InputPasscode: React.FC<{ value: string; onChange: any }> = ({ value, onChange }) => {
  return (
    <View style={styles.content}>
      <Item floatingLabel style={styles.item}>
        <Label>Enter passcode</Label>
        <Input value={value} onChangeText={onChange} secureTextEntry />
      </Item>
    </View>
  );
};
export const Protected: React.FC<{ code: string; navigation }> = ({ children, code, navigation }) => {
  const [passcode, setPasscode] = useState('');
  navigation.addListener('focus', payload => setPasscode(''));

  return passcode === code ? children : <InputPasscode value={passcode} onChange={setPasscode} />;
};

const styles = StyleSheet.create({
  item: {
    width: 300,
  },
  content: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

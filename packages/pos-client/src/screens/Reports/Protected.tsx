import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Item, Label } from '../../core';
import { moderateScale } from '../../utils/scaling';

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
  navigation.addListener('focus', () => setPasscode(''));

  return passcode === code ? children : <InputPasscode value={passcode} onChange={setPasscode} />;
};

const styles = StyleSheet.create({
  item: {
    width: moderateScale(300),
  },
  content: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

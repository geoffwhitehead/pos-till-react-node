import React, { useState } from 'react';
import { Content, Label, Input, Item } from '../../core';

const InputPasscode: React.FC<{ value: string; onChange: any }> = ({ value, onChange }) => {
  return (
    <Content>
      <Item>
        <Label>Input passcode</Label>
        <Input value={value} onChangeText={onChange} secureTextEntry />
      </Item>
    </Content>
  );
};
export const Protected: React.FC<{ code: string; navigation }> = ({ children, code, navigation }) => {
  const [passcode, setPasscode] = useState('');
  navigation.addListener('focus', payload => setPasscode(''));

  return passcode === code ? children : <InputPasscode value={passcode} onChange={setPasscode} />;
};

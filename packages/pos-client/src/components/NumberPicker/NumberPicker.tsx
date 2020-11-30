import { Icon, Input, View } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { fontSizes } from '../../theme';
import { moderateScale } from '../../utils/scaling';

export const NumberPicker: React.FC<{ value?: number; onPress?: (v: number) => void }> = ({ value, onPress }) => {
  const [_value, _setValue] = useState(value || 1);

  const _onPress = v => {
    _setValue(v);
    onPress(v);
  };

  return (
    <View style={styles.numberPicker}>
      <Icon style={styles.icon} onPress={() => _onPress(_value === 1 ? _value : _value - 1)} name="ios-remove" />
      <Input style={styles.numberInput} value={(value && value.toString()) || _value.toString()} />
      <Icon style={styles.icon} onPress={() => _onPress(_value + 1)} name="ios-add" />
    </View>
  );
};

const styles = StyleSheet.create({
  numberPicker: {
    maxWidth: moderateScale(200),
    marginTop: moderateScale(30),
    marginLeft: 'auto',
    marginRight: 'auto',
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  numberInput: {
    textAlign: 'center',
    width: moderateScale(60),
    maxWidth: moderateScale(120),
    fontSize: fontSizes[5],
    fontWeight: 'bold',
  },
  icon: { fontSize: fontSizes[8] },
});

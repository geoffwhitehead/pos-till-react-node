import React from 'react';
import { Picker as RNPicker } from '@react-native-picker/picker';
import { StyleSheet } from 'react-native';
import { Item } from 'native-base';

interface PickerProps {
  mode?: 'dialog' | 'dropdown';
  style?: any;
  selectedValue?: string | number;
  onValueChange?: (value: string | number, index: number) => void;
  placeholder?: string;
  placeholderStyle?: any;
  textStyle?: any;
  itemStyle?: any;
  itemTextStyle?: any;
  iosHeader?: string;
  children?: React.ReactNode;
}

interface PickerItemProps {
  label: string;
  value: string | number;
}

const PickerComponent: React.FC<PickerProps> & {
  Item: React.FC<PickerItemProps>;
} = ({
  mode = 'dialog',
  style,
  selectedValue,
  onValueChange,
  placeholder,
  placeholderStyle,
  textStyle,
  itemStyle,
  children,
  ...props
}) => {
  return (
    <Item picker style={styles.item}>
      <RNPicker
        mode={mode}
        style={[styles.picker, style]}
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        {...props}
      >
        {placeholder && (
          <RNPicker.Item
            label={placeholder}
            value={null}
            style={[styles.placeholder, placeholderStyle]}
          />
        )}
        {children}
      </RNPicker>
    </Item>
  );
};

const PickerItem: React.FC<PickerItemProps> = ({ label, value }) => {
  return <RNPicker.Item label={label} value={value} />;
};

PickerComponent.Item = PickerItem;

const styles = StyleSheet.create({
  item: {
    padding: 0,
  },
  picker: {
    width: '100%',
    height: 50,
  },
  placeholder: {
    color: '#999',
  },
});

export const Picker = PickerComponent;

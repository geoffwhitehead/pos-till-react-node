import React from 'react';
import { StyleSheet } from 'react-native';
import { Item, Label } from '../../core';
import { paddingHelper } from '../../utils/helpers';
import { moderateScale } from '../../utils/scaling';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { FormInputDescription } from '../FormInputDescription/FormInputDescription';

type ItemFieldProps = {
  errors: any; // TODO
  touched: boolean;
  name: string;
  label: string;
  style?: Record<string, any>;
  picker?: boolean;
  disabled?: boolean;
  styleLabel?: Object;
  type?: 'fixedLabel' | 'stackedLabel';
  description?: string;
};

export const ItemField: React.FC<ItemFieldProps> = ({
  picker = false,
  errors,
  touched,
  name,
  label,
  children,
  type = 'stackedLabel',
  style = {},
  disabled = false,
  styleLabel = {},
  description,
}) => {
  const props = {
    [type]: true,
  };

  return (
    <>
      <Item
        disabled={disabled}
        picker={picker}
        style={{ ...(description ? styles.itemField : styles.itemFieldNoDesc), ...style }}
        error={touched && (errors?.length > 0 || errors)}
        {...props}
      >
        <Label style={styleLabel}>{label}</Label>
        {description && (
          <FormInputDescription style={styles.text} description={description}>
            {description}
          </FormInputDescription>
        )}
        {children}
      </Item>
      <ErrorMessage name={name} />
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    ...paddingHelper(10, 0, 0, 0),
  },
  itemField: {
    alignItems: 'flex-start',
    minHeight: moderateScale(100),
  },
  itemFieldNoDesc: {
    alignItems: 'flex-start',
  },
});

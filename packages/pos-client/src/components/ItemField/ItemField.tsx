import React from 'react';
import { Item, Label } from '../../core';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';

type ItemFieldProps = {
  errors: any; // TODO
  touched: boolean;
  name: string;
  label: string;
  style?: Record<string, any>;
  picker?: boolean;
  disabled?: boolean;
  styleLabel?: Object;
  // textColor?: string
};

export const ItemField: React.FC<ItemFieldProps> = ({
  picker = false,
  errors,
  touched,
  name,
  label,
  children,
  style = {},
  disabled = false,
  styleLabel = {},
}) => {
  return (
    <>
      <Item
        disabled={disabled}
        picker={picker}
        stackedLabel
        style={style}
        error={touched && (errors?.length > 0 || errors)}
      >
        <Label style={styleLabel}>{label}</Label>
        {children}
      </Item>
      <ErrorMessage name={name} />
    </>
  );
};

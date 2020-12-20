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
  type?: 'fixedLabel' | 'stackedLabel';
  // textColor?: string
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
}) => {
  const props = {
    [type]: true,
  };

  return (
    <>
      <Item
        disabled={disabled}
        picker={picker}
        style={style}
        error={touched && (errors?.length > 0 || errors)}
        {...props}
      >
        <Label style={styleLabel}>{label}</Label>
        {children}
      </Item>
      <ErrorMessage name={name} />
    </>
  );
};

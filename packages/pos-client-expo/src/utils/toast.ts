import { Toast } from '../core';

type ToastProps = {
  type?: 'danger' | 'warning' | 'success';
  message: string;
  buttonText?: string;
};
export const toast = ({ type = 'danger', message, buttonText = 'Okay' }: ToastProps) => {
  Toast.show({
    text: message,
    buttonText,
    duration: 5000,
    type,
  });
};

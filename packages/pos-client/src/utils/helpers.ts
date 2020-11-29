import { ActionSheet } from '../core';

export const resolveButtonState = (isDisabled: boolean, stdState: string) =>
  isDisabled ? { disabled: true } : { [stdState]: true };

export const areYouSure = fn => {
  const options = ['Yes', 'Cancel'];
  ActionSheet.show(
    {
      options,
      title: 'Are you sure?',
    },
    index => {
      index === 0 && fn();
    },
  );
};

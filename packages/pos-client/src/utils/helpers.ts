export const resolveButtonState = (isDisabled: boolean, stdState: string) =>
  isDisabled ? { disabled: true } : { [stdState]: true };

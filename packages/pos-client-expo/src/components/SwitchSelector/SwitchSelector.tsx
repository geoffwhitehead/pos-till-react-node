import React from 'react';
import Switch, { ISwitchSelectorProps } from 'react-native-switch-selector';
import { colors } from '../../theme';

type SwitchProps = {
  themeColor?: string;
  initial: string | number;
};

export const SwitchSelector: React.FC<Omit<ISwitchSelectorProps, 'initial'> & SwitchProps> = ({
  themeColor = colors.darkBlue,
  initial,
  options,
  ...props
}) => {
  const init = options.findIndex(o => o.value === initial) || 0;

  return (
    <Switch
      textColor={themeColor} //'#7a44cf'
      selectedColor={colors.white}
      buttonColor={themeColor}
      borderColor={themeColor}
      options={options}
      initial={init}
      hasPadding
      {...props}
    />
  );
};

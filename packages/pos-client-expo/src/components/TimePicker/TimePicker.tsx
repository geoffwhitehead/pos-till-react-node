import dayjs from 'dayjs';
import React from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { View } from '../../core';

type TimePickerProps = {
  isVisible: boolean;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  value?: Date;
  title?: string;
  mode: 'date' | 'time' | 'datetime';
};

export const TimePicker: React.FC<TimePickerProps> = ({
  onConfirm,
  onCancel,
  isVisible,
  value,
  title = 'Pick a date / time',
  mode,
}) => {
  return (
    <View>
      <DateTimePickerModal
        headerTextIOS={title}
        isVisible={isVisible}
        mode={mode}
        onConfirm={onConfirm}
        onCancel={onCancel}
        date={value ? dayjs(value).toDate() : undefined}
      />
    </View>
  );
};

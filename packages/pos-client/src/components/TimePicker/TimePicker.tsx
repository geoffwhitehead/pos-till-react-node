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
};

export const TimePicker: React.FC<TimePickerProps> = ({
  onConfirm,
  onCancel,
  isVisible,
  value,
  title = 'Pick a date / time',
}) => {
  return (
    <View>
      <DateTimePickerModal
        headerTextIOS={title}
        isVisible={isVisible}
        mode="time"
        onConfirm={onConfirm}
        onCancel={onCancel}
        date={value ? dayjs(value).toDate() : undefined}
      />
    </View>
  );
};

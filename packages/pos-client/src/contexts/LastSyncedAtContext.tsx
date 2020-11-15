import { Dayjs } from 'dayjs';
import React from 'react';

type LastSyncedAtProps = {
  setLastSyncedAt: (lastSyncedAt: Dayjs) => void;
  lastSyncedAt: Dayjs;
};

export const LastSyncedAtContext = React.createContext<LastSyncedAtProps>({
  setLastSyncedAt: () => {},
  lastSyncedAt: null,
});

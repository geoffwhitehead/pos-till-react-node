import { useDatabase } from '@nozbe/watermelondb/hooks';
import dayjs from 'dayjs';
import { useContext, useState } from 'react';
import { LastSyncedAtContext } from '../contexts/LastSyncedAtContext';
import { Toast } from '../core';
import { sync } from '../services/sync';

export const useSync = () => {
  const { setLastSyncedAt } = useContext(LastSyncedAtContext);
  const database = useDatabase();
  const [isSyncing, setIsSyncing] = useState(false);

  const doSync = async () => {
    try {
      setIsSyncing(true);
      await sync(database);
      console.log('DONE');
      setLastSyncedAt(dayjs());
      setIsSyncing(false);
    } catch (err) {
      Toast.show({
        text: `Sync Failed. Error ${err}`,
        buttonText: 'Okay',
        duration: 5000,
        type: 'danger',
      });
      return { success: false };
    }
    return { success: true };
  };

  return [isSyncing, doSync] as const;
};

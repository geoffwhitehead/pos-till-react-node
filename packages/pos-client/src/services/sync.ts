import { Database } from '@nozbe/watermelondb';
import { synchronize } from '@nozbe/watermelondb/sync';
import { pullChanges, pushChanges } from '../api/sync';

export const sync = async (database: Database) => {
  //   const database = useDatabase();
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt }) => {
      const response = await pullChanges({ lastPulledAt, schemaVersion: '0', migration: null });

      if (!response.ok) {
        throw new Error('Sync pull failed');
      }

      const { changes, timestamp } = await response.data;
      return { changes, timestamp };
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      const response = await pushChanges({ lastPulledAt, changes: JSON.stringify(changes) });
      if (!response.ok) {
        throw new Error('Sync push failed');
      }
    },
    // migrationsEnabledAtVersion: 1,
  });
};

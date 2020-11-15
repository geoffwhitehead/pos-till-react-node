import { Database } from '@nozbe/watermelondb';
import { synchronize } from '@nozbe/watermelondb/sync';
import { pullChanges, pushChanges } from '../api/sync';

export const sync = async (database: Database) => {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt }) => {
      const response = await pullChanges({ lastPulledAt, schemaVersion: '21', migration: null });

      if (!response.ok || !response.data.changes) {
        throw new Error('Sync pull failed');
      }

      const { changes, timestamp } = response.data;
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

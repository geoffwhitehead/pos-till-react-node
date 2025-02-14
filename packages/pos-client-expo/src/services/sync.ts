import { Database } from '@nozbe/watermelondb';
import { synchronize } from '@nozbe/watermelondb/sync';
import retry from 'async-retry';
import { pullChanges, pushChanges } from '../api/sync';

export const sync = async (database: Database) => {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt }) => {
      return await retry(
        async bail => {
          const response = await pullChanges({ lastPulledAt, schemaVersion: '21', migration: null });

          if (!response.ok || !response.data.changes) {
            bail(new Error('Sync pull failed'));
          }

          const { changes, timestamp } = response.data;
          return { changes, timestamp };
        },
        { retries: 2 },
      );
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      return await retry(
        async bail => {
          const response = await pushChanges({ lastPulledAt, changes: JSON.stringify(changes) });
          if (!response.ok) {
            bail(new Error('Sync push failed'));
          }
        },
        { retries: 2 },
      );
    },
    // migrationsEnabledAtVersion: 1,
  });
};

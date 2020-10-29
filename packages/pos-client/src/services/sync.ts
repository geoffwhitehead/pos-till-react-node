import { Database } from '@nozbe/watermelondb';
import { synchronize } from '@nozbe/watermelondb/sync';
import { pullChanges, pushChanges } from '../api/sync';

export const sync = async (database: Database) => {
  console.log('database', database);
  //   const database = useDatabase();
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt }) => {
      console.log('pulling');
      const response = await pullChanges({ lastPulledAt, schemaVersion: '21', migration: null });

      console.log('response', response);
      if (!response.ok || !response.data.changes) {
        throw new Error('Sync pull failed');
      }
      console.log('!!!!!!!---------');
      console.log('!!!!!!!---------');
      console.log('!!!!!!!---------');

      console.log('RESPONSE', response.data.changes);

      const { changes, timestamp } = response.data;
      return { changes, timestamp };
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      console.log('!!!!!!!---------');
      console.log('!!!!!!!---------');
      console.log('!!!!!!!---------');
      console.log('!!!!!!!---------');
      console.log('PUSHING', changes);
      const response = await pushChanges({ lastPulledAt, changes: JSON.stringify(changes) });
      if (!response.ok) {
        throw new Error('Sync push failed');
      }
    },
    // migrationsEnabledAtVersion: 1,
  });

  console.log('SYNC DONE');
};

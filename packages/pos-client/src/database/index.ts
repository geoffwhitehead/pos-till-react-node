import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { appSchema, Database } from '@nozbe/watermelondb';
import { schemas, models } from '../models';

const adapter = new SQLiteAdapter({
  schema: appSchema({
    version: 9,
    tables: Object.values(schemas),
  }),
});

export const database = new Database({
  adapter,
  modelClasses: Object.values(models),
  actionsEnabled: true,
});

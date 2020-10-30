import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { appSchema, Database } from '@nozbe/watermelondb';
import { schemas, models } from '../models';

const adapter = new SQLiteAdapter({
  schema: appSchema({
    version: 29,
    tables: Object.values(schemas),
  }),
});

export const database = new Database({
  adapter,
  modelClasses: Object.values(models),
  actionsEnabled: true,
});

export const resetDatabase = async () => {
  try {
    await database.action(async () => {
      await database.unsafeResetDatabase();
      return { success: true };
    });
  } catch (e) {
    console.log('ERRROR resetting db :', e);
    return {
      success: false,
      error: e,
    };
  }
};

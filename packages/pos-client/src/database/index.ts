import { appSchema, Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { models, schemas } from '../models';

const adapter = new SQLiteAdapter({
  schema: appSchema({
    version: 57,
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
    console.log('Error resetting db :', e);
    return {
      success: false,
      error: e,
    };
  }
};

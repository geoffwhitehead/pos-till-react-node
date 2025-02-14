import { appSchema, Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { models, schemas } from '../models';

const adapter = new SQLiteAdapter({
  schema: appSchema({
    version: 77,
    tables: Object.values(schemas),
  }),
});

export const database = new Database({
  adapter,
  modelClasses: Object.values(models),
});

export const resetDatabase = async () => {
  try {
    await database.action(async () => {
      await database.unsafeResetDatabase();
    });
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  }
};

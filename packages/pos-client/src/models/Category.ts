import { Model, tableSchema, Query } from '@nozbe/watermelondb';
import { children, nochange, field } from '@nozbe/watermelondb/decorators';
import { Item } from './Item';

export class Category extends Model {
  static table = 'categories';

  @children('items') items: Query<Item>;

  @nochange @field('name') name: string;

  static associations = {
    items: { type: 'has_many', foreignKey: 'category_id' },
  };
}

export const categorySchema = tableSchema({
  name: 'categories',
  columns: [{ name: 'name', type: 'string' }],
});
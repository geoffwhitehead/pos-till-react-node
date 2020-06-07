import { Model, tableSchema } from '@nozbe/watermelondb';
import { children, nochange, field } from '@nozbe/watermelondb/decorators';

export class Category extends Model {
  static table = 'categories';

  @children('items') items;

  @nochange @field('name') name;

  static associations = {
    items: { type: 'has_many', foreignKey: 'category_id' },
  };
}

export const categorySchema = tableSchema({
  name: 'categories',
  columns: [{ name: 'name', type: 'string' }],
});

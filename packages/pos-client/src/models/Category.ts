import { Model, Query, tableSchema } from '@nozbe/watermelondb';
import { children, field, nochange } from '@nozbe/watermelondb/decorators';
import { Item } from './Item';

export class Category extends Model {
  static table = 'categories';

  static associations = {
    items: { type: 'has_many', foreignKey: 'category_id' },
    print_categories: { type: 'belongs_to', key: 'print_category_id' },
  };

  @children('items') items: Query<Item>;

  @nochange @field('name') name: string;
  @field('short_name') shortName: string;
  @field('background_color') backgroundColor: string;
  @field('text_color') textColor: string;

  @field('position_index') positionIndex: number;
  @field('print_category_id') printCategoryId: string;
}

export const categorySchema = tableSchema({
  name: 'categories',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'short_name', type: 'string' },
    { name: 'background_color', type: 'string' },
    { name: 'text_color', type: 'string' },
    { name: 'position_index', type: 'number' },
    { name: 'print_category_id', type: 'number', isOptional: true },
  ],
});

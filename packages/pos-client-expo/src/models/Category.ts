import { Model, Query, Relation, tableSchema } from '@nozbe/watermelondb';
import { children, field, nochange, relation } from '@nozbe/watermelondb/decorators';
import { PrintCategory } from '.';
import { Item } from './Item';
import { ASSOCIATION_TYPES } from './constants';

export class Category extends Model {
  static table = 'categories';

  static associations = {
    items: { type: ASSOCIATION_TYPES.HAS_MANY, foreignKey: 'category_id' },
    print_categories: { type: ASSOCIATION_TYPES.BELONGS_TO, key: 'print_category_id' },
  };

  @children('items') items!: Query<Item>;
  @relation('print_categories', 'print_category_id') printCategory!: Relation<PrintCategory>;

  @nochange @field('name') name!: string;
  @field('short_name') shortName!: string;
  @field('background_color') backgroundColor!: string;
  @field('text_color') textColor!: string;
  @field('position_index') positionIndex!: number;
  @field('print_category_id') printCategoryId?: string;
}

export const categorySchema = tableSchema({
  name: 'categories',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'short_name', type: 'string' },
    { name: 'background_color', type: 'string' },
    { name: 'text_color', type: 'string' },
    { name: 'position_index', type: 'number' },
    { name: 'print_category_id', type: 'string', isOptional: true },
  ],
});

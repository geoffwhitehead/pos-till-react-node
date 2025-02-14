import { Model, Query, tableSchema } from '@nozbe/watermelondb';
import { children, field } from '@nozbe/watermelondb/decorators';
import { Category } from '.';

export type PrintCategoryProps = {
  name: string;
  shortName: string;
  displayOrder: number;
};

export class PrintCategory extends Model {
  static table = 'print_categories';

  static associations = {
    categories: { type: 'has_many', foreignKey: 'print_category_id' },
  };

  @children('categories') categories: Query<Category>;

  @field('name') name: string;
  @field('short_name') shortName: string;
  @field('display_order') displayOrder: number;
}

export const printCategorySchema = tableSchema({
  name: 'print_categories',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'short_name', type: 'string' },
    { name: 'display_order', type: 'number' },
  ],
});

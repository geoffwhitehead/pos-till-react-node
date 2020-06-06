import { Model } from '@nozbe/watermelondb';
import { tableNames } from '.';
import { children, nochange, field } from '@nozbe/watermelondb/decorators';

export class Category extends Model {
  static table = tableNames.categories;

  @children(tableNames.items) items;

  @nochange @field('name') name;

  static associations = {
    [tableNames.items]: { type: 'has_many', foreignKey: 'category_id' },
  };
}

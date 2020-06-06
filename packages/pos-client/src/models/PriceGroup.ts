import { Model, tableSchema } from '@nozbe/watermelondb';
import { tableNames } from '.';
import { field } from '@nozbe/watermelondb/decorators';

export class PriceGroupModel extends Model {
  static table = tableNames.priceGroups;

  @field('name') name;
}

export const priceGroupSchema = tableSchema({
  name: 'price_groups',
  columns: [{ name: 'name', type: 'string' }],
});

import { Model, tableSchema } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class PriceGroup extends Model {
  static table = 'price_groups';

  @field('name') name: string;
}

export const priceGroupSchema = tableSchema({
  name: 'price_groups',
  columns: [{ name: 'name', type: 'string' }],
});

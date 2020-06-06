import { Model, tableSchema } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class PriceGroupModel extends Model {
  static table = 'price_groups';

  @field('name') name;
}

export const priceGroupSchema = tableSchema({
  name: 'price_groups',
  columns: [{ name: 'name', type: 'string' }],
});

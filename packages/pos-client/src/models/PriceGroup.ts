import { Model, tableSchema } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class PriceGroup extends Model {
  static table = 'price_groups';

  @field('name') name: string;
  @field('short_name') shortName: string;
  @field('is_prep_time_required') isPrepTimeRequired: string;
}

export const priceGroupSchema = tableSchema({
  name: 'price_groups',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'short_name', type: 'string' },
    { name: 'is_prep_time_required', type: 'string' },
  ],
});

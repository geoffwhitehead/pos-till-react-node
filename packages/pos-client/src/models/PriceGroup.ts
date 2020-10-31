import { Model, tableSchema } from '@nozbe/watermelondb';
import { action, field } from '@nozbe/watermelondb/decorators';

export class PriceGroup extends Model {
  static table = 'price_groups';

  @field('name') name: string;
  @field('short_name') shortName: string;
  @field('is_prep_time_required') isPrepTimeRequired: boolean;

  @action updatePriceGroup = (values: { name: string; shortName: string; isPrepTimeRequired: boolean }) => {
    console.log('values', values);
    this.database.action(async () => {
      await this.update(record => Object.assign(record, values));
    });
  };

  @action remove = async () =>
    this.database.action(async () => {
      await this.markAsDeleted();
    });
}

export const priceGroupSchema = tableSchema({
  name: 'price_groups',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'short_name', type: 'string' },
    { name: 'is_prep_time_required', type: 'boolean' },
  ],
});

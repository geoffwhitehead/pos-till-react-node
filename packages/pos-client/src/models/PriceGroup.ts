import { Model, tableSchema } from '@nozbe/watermelondb';
import { action, field } from '@nozbe/watermelondb/decorators';
import { Organization } from '.';

export class PriceGroup extends Model {
  static table = 'price_groups';

  @field('name') name: string;
  @field('short_name') shortName: string;
  @field('is_prep_time_required') isPrepTimeRequired: boolean;

  @action updatePriceGroup = async (values: { name: string; shortName: string; isPrepTimeRequired: boolean }) => {
    await this.update(record => Object.assign(record, values));
  };

  @action remove = async (organization: Organization) => {
    await this.markAsDeleted();
    if (organization.defaultPriceGroupId === this.id) {
      await organization.update(record => record.defaultPriceGroup.set(null));
    }
  };
}

export const priceGroupSchema = tableSchema({
  name: 'price_groups',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'short_name', type: 'string' },
    { name: 'is_prep_time_required', type: 'boolean' },
  ],
});

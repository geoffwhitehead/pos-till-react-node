import { Model, Q, Query, tableSchema } from '@nozbe/watermelondb';
import { action, children, field, lazy } from '@nozbe/watermelondb/decorators';
import { BillItem, Organization } from '.';

export const priceGroupSchema = tableSchema({
  name: 'price_groups',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'short_name', type: 'string' },
    { name: 'is_prep_time_required', type: 'boolean' },
  ],
});

export class PriceGroup extends Model {
  static table = 'price_groups';

  static associations = {
    bill_items: { type: 'has_many', foreignKey: 'price_group_id' },
  };

  @field('name') name: string;
  @field('short_name') shortName: string;
  @field('is_prep_time_required') isPrepTimeRequired: boolean;

  @children('bill_items') billItems: Query<BillItem>;

  @lazy billItemsExclVoids = this.billItems.extend(Q.where('is_voided', Q.notEq(true)));

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

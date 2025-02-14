import { Model, Q, Query, tableSchema } from '@nozbe/watermelondb';
import { action, children, field, lazy } from '@nozbe/watermelondb/decorators';
import { BillItem, ItemPrice, Organization } from '.';
import { ASSOCIATION_TYPES } from './constants';

export const priceGroupSchema = tableSchema({
  name: 'price_groups',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'short_name', type: 'string' },
    { name: 'is_prep_time_required', type: 'boolean' },
    { name: 'color', type: 'string', isOptional: true },
  ],
});

export class PriceGroup extends Model {
  static table = 'price_groups';

  static associations = {
    bill_items: { type: ASSOCIATION_TYPES.HAS_MANY, foreignKey: 'price_group_id' },
    item_prices: { type: ASSOCIATION_TYPES.HAS_MANY, foreignKey: 'price_group_id' },
  };

  @field('name') name!: string;
  @field('short_name') shortName!: string;
  @field('is_prep_time_required') isPrepTimeRequired!: boolean;
  @field('color') color?: string;

  @children('bill_items') billItems!: Query<BillItem>;
  @children('item_prices') itemPrices!: Query<ItemPrice>;

  @lazy billItemsExclVoids = this.billItems.extend(Q.where('is_voided', Q.notEq(true)));

  @action async updatePriceGroup(values: { name: string; shortName: string; isPrepTimeRequired: boolean }) {
    await this.update(record => Object.assign(record, values));
  }

  @action async remove(organization: Organization) {
    await this.markAsDeleted();
    if (organization.defaultPriceGroupId === this.id) {
      await organization.update(record => record.defaultPriceGroup.set(null as any));
    }
  }
}

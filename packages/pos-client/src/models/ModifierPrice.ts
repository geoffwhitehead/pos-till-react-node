import { Model } from '@nozbe/watermelondb';
import { tableNames } from '.';
import { field, relation } from '@nozbe/watermelondb/decorators';

export class ModifierPrice extends Model {
  static table = tableNames.modifierPrices;

  @field('price') price;
  @field('price_group_id') priceGroupId;
  @field('modifier_item_id') modifierItemId;

  @relation(tableNames.priceGroups, 'price_group_id') priceGroup;
  @relation(tableNames.modifierItems, 'modifier_item_id') modifierItem;
}

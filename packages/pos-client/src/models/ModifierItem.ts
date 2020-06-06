import { Model } from '@nozbe/watermelondb';
import { tableNames } from '.';
import { field, relation, children } from '@nozbe/watermelondb/decorators';

export class ModifierItem extends Model {
  static table = tableNames.modifierItems;

  @field('name') name;
  @field('modifier_id') modifierId;

  @relation(tableNames.modifiers, 'modifier_id') modifier;

  @children(tableNames.modifierPrices, 'modifier_item_id') prices;

  static associations = {
    [tableNames.modifierPrices]: { type: 'has_many', foreignKey: 'modifier_item_id' },
    [tableNames.modifiers]: { type: 'belongs_to', key: 'modifier_id' },
  };
}

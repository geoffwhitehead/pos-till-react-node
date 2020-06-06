import { Model } from '@nozbe/watermelondb';
import { tableNames } from '.';
import { field, children } from '@nozbe/watermelondb/decorators';

export class Modifier extends Model {
  static table = tableNames.modifiers;

  @field('name') name;
  @field('min_items') minItems;
  @field('max_items') maxItems;

  static associations = {
    [tableNames.itemModifiers]: { type: 'has_many', foreignKey: 'modifier_id' },
    [tableNames.modifierItems]: { type: 'has_many', foreignKey: 'modifier_id' },
    [tableNames.items]: { type: 'belongs_to', foreignKey: 'modifier_id' },
  };

  @children(tableNames.modifierItems) modifierItems;
}

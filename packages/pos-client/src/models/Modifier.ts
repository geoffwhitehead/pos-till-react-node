import { Model, tableSchema, Query } from '@nozbe/watermelondb';
import { field, children } from '@nozbe/watermelondb/decorators';
import { ModifierItem } from './ModifierItem';

export class Modifier extends Model {
  static table = 'modifiers';

  @field('name') name: string;
  @field('min_items') minItems: number;
  @field('max_items') maxItems: number;

  static associations = {
    item_modifiers: { type: 'has_many', foreignKey: 'modifier_id' },
    modifier_items: { type: 'has_many', foreignKey: 'modifier_id' },
    items: { type: 'belongs_to', foreignKey: 'modifier_id' },
  };

  @children('modifier_items') modifierItems: Query<ModifierItem>;
}

export const modifierSchema = tableSchema({
  name: 'modifiers',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'min_items', type: 'number' },
    { name: 'max_items', type: 'number' },
  ],
});

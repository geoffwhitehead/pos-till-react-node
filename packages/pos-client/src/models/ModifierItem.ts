import { Model, tableSchema, Relation, Query } from '@nozbe/watermelondb';
import { field, relation, children } from '@nozbe/watermelondb/decorators';
import { Modifier } from './Modifier';
import { ModifierPrice } from './ModifierPrice';

export class ModifierItem extends Model {
  static table = 'modifier_items';

  @field('name') name: string;
  @field('modifier_id') modifierId: string;

  @relation('modifiers', 'modifier_id') modifier: Relation<Modifier>;

  @children('modifier_prices') prices: Query<ModifierPrice>;

  static associations = {
    modifier_prices: { type: 'has_many', foreignKey: 'modifier_item_id' },
    modifiers: { type: 'belongs_to', key: 'modifier_id' },
  };
}

export const modifierItemSchema = tableSchema({
  name: 'modifier_items',
  columns: [
    { name: 'modifier_id', type: 'string', isIndexed: true },
    { name: 'name', type: 'string' },
  ],
});

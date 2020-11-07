import { Model, tableSchema, Query, Q } from '@nozbe/watermelondb';
import { field, children, lazy, action } from '@nozbe/watermelondb/decorators';
import { ModifierPrice, tableNames } from '.';
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
  @children('item_modifiers') itemModifiers: Query<ModifierItem>; // pivot table - items assigned to this printer

  @lazy modifierItemPrices = this.collections
    .get<ModifierPrice>(tableNames.modifierPrices)
    .query(Q.on(tableNames.modifierItems, 'modifier_id', this.id)) as Query<ModifierPrice>;

  @action remove = async () => {
    const [modifierItems, modifierPrices, itemModifiers] = await Promise.all([
      this.modifierItems.fetch(),
      this.modifierItemPrices.fetch(),
      this.itemModifiers.fetch(),
    ]);

    const modifierItemsToDelete = modifierItems.map(modifierItem => modifierItem.prepareMarkAsDeleted());
    const modifierPricesToDelete = modifierPrices.map(modifierPrice => modifierPrice.prepareMarkAsDeleted());
    const itemModifiersToDelete = itemModifiers.map(itemModifier => itemModifier.prepareMarkAsDeleted());

    const batched = [...modifierItemsToDelete, ...modifierPricesToDelete, ...itemModifiersToDelete];

    await this.batch(...batched);
  };
}

export const modifierSchema = tableSchema({
  name: 'modifiers',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'min_items', type: 'number' },
    { name: 'max_items', type: 'number' },
  ],
});

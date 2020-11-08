import { Model, Q, Query, tableSchema } from '@nozbe/watermelondb';
import { action, children, field, lazy } from '@nozbe/watermelondb/decorators';
import { ModifierItemPrice, tableNames } from '.';
import { ModifierItem } from './ModifierItem';

type UpdateValues = {
  name: string;
  minItems: number;
  maxItems: number;
};

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
    .get<ModifierItemPrice>(tableNames.modifierItemPrices)
    .query(Q.on(tableNames.modifierItems, 'modifier_id', this.id)) as Query<ModifierItemPrice>;

  @action updateItem = async (values: UpdateValues) => {
    const { name, minItems, maxItems } = values;
    await this.update(record =>
      Object.assign(record, {
        name,
        minItems,
        maxItems,
      }),
    );
  };

  @action remove = async () => {
    const [modifierItems, modifierItemPrices, itemModifiers] = await Promise.all([
      this.modifierItems.fetch(),
      this.modifierItemPrices.fetch(),
      this.itemModifiers.fetch(),
    ]);

    const modifierItemsToDelete = modifierItems.map(modifierItem => modifierItem.prepareMarkAsDeleted());
    const modifierItemPricesToDelete = modifierItemPrices.map(modifierItemPrice =>
      modifierItemPrice.prepareMarkAsDeleted(),
    );
    const itemModifiersToDelete = itemModifiers.map(itemModifier => itemModifier.prepareMarkAsDeleted());

    const batched = [...modifierItemsToDelete, ...modifierItemPricesToDelete, ...itemModifiersToDelete];

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

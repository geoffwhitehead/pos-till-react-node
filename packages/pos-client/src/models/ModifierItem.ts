import { Model, tableSchema, Relation, Query } from '@nozbe/watermelondb';
import { field, relation, children, action } from '@nozbe/watermelondb/decorators';
import { Modifier } from './Modifier';
import { ModifierPrice } from './ModifierPrice';

type UpdateItemAndPricesValues = {
  name: string;
  shortName: string;
  prices: { modifierItemPrice: ModifierPrice; price: number }[];
};

export class ModifierItem extends Model {
  static table = 'modifier_items';

  @field('name') name: string;
  @field('short_name') shortName: string;
  @field('modifier_id') modifierId: string;

  @relation('modifiers', 'modifier_id') modifier: Relation<Modifier>;

  @children('modifier_prices') prices: Query<ModifierPrice>;

  @action updateItem = async (values: UpdateItemAndPricesValues) => {
    const { name, prices, shortName } = values;
    const modifierItemToUpdate = this.prepareUpdate(record => Object.assign(record, { name, shortName }));

    const modifierPricesToUpdate = prices.map(({ modifierItemPrice, price }) =>
      modifierItemPrice.prepareUpdate(record => Object.assign(record, { price })),
    );

    const batched = [modifierItemToUpdate, ...modifierPricesToUpdate];

    await this.database.batch(...batched);
  };

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
    { name: 'short_name', type: 'string' },
  ],
});

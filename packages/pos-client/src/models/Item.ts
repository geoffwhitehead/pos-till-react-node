import { Model, Q, tableSchema, Relation, Query } from '@nozbe/watermelondb';
import { field, relation, children, lazy, action } from '@nozbe/watermelondb/decorators';
import { Category } from './Category';
import { ItemPrice } from './ItemPrice';
import { Printer } from './Printer';
import { Modifier } from './Modifier';
import { PrinterGroup, ModifierItem, ItemModifier, tableNames, PriceGroup } from '.';

export class Item extends Model {
  static table = 'items';

  @field('name') name: string;
  @field('short_name') shortName: string;
  @field('category_id') categoryId: string;
  @field('printer_group_id') printerGroupId: string;

  @relation('categories', 'category_id') category: Relation<Category>;
  @relation('printer_groups', 'printer_group_id') printerGroup: Relation<PrinterGroup>;

  static associations = {
    item_modifiers: { type: 'has_many', foreignKey: 'item_id' },
    modifiers: { type: 'belongs_to', key: 'modifier_id' },
    categories: { type: 'belongs_to', key: 'category_id' },
    item_prices: { type: 'has_many', foreignKey: 'item_id' },
    printer_groups: { type: 'belongs_to', key: 'printer_group_id' },
  };

  @children('item_prices') prices: Query<ItemPrice>;
  @children('item_modifiers') itemModifierLinks: Query<ItemModifier>;

  @lazy printers = this.collections
    .get('printers')
    .query(Q.on('printer_groups_printers', 'printer_group_id', this.printerGroupId)) as Query<Printer>;
  @lazy modifiers = this.collections.get('modifiers').query(Q.on('item_modifiers', 'item_id', this.id)) as Query<
    Modifier
  >;

  @action remove = async () => {
    const [prices, modifierRefs] = await Promise.all([this.prices.fetch(), this.itemModifierLinks.fetch()]);

    const pricesToDelete = prices.map(price => price.prepareMarkAsDeleted());
    const modifierRefsToDelete = modifierRefs.map(modifierRef => modifierRef.prepareMarkAsDeleted());
    const toRemove = [this.prepareMarkAsDeleted(), ...pricesToDelete, ...modifierRefsToDelete];
    await this.database.action(async () => await this.database.batch(...toRemove));
  };

  @action updateItem = async ({
    name,
    shortName,
    categoryId,
    printerGroupId,
    prices,
    modifiers,
  }: {
    name: string;
    shortName: string;
    categoryId: string;
    printerGroupId: string;
    modifiers: Modifier[];
    prices: { price: string; priceGroup: PriceGroup }[];
  }) => {
    const modifierLinksCollection = this.database.collections.get<ItemModifier>(tableNames.itemModifiers);
    const itemPricesCollection = this.database.collections.get<ItemPrice>(tableNames.itemPrices);

    let batched = [];

    const [itemPrices, itemModifierLinks, priceGroups] = await Promise.all([
      this.prices.fetch(),
      this.itemModifierLinks.fetch(),
      this.database.collections
        .get<PriceGroup>(tableNames.priceGroups)
        .query()
        .fetch(),
    ]);

    batched.push(
      this.prepareUpdate(itemRecord => {
        Object.assign(itemRecord, { name, shortName, categoryId, printerGroupId });
      }),
    );

    batched.push(...itemModifierLinks.map(l => l.prepareMarkAsDeleted()));
    batched.push(
      ...modifiers.map(modifier => {
        return modifierLinksCollection.prepareCreate(modifierLink => {
          modifierLink.modifier.set(modifier);
          modifierLink.item.set(this);
        });
      }),
    );

    batched.push(
      ...priceGroups.map(priceGroup => {
        const existingRecord = itemPrices.find(iP => iP.priceGroupId === priceGroup.id);
        const newPrice = prices.find(p => p.priceGroup.id === priceGroup.id)?.price;

        if (newPrice) {
          if (existingRecord) {
            return existingRecord.prepareUpdate(itemPriceRecord => {
              Object.assign(itemPriceRecord, { price: newPrice ? parseInt(newPrice) : null });
            });
          } else {
            return itemPricesCollection.prepareCreate(newItemPriceRecord => {
              newItemPriceRecord.item.set(this);
              newItemPriceRecord.priceGroup.set(priceGroup);
              Object.assign(newItemPriceRecord, {
                price: newPrice ? parseInt(newPrice) : null,
              });
            });
          }
        } else if (existingRecord) {
          return existingRecord.prepareMarkAsDeleted();
        }
        return null;
      }),
    );

    await this.database.action(async () => await this.database.batch(...batched));
  };
}

export const itemSchema = tableSchema({
  name: 'items',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'short_name', type: 'string' },
    { name: 'category_id', type: 'string', isIndexed: true },
    { name: 'printer_group_id', type: 'string' },
  ],
});

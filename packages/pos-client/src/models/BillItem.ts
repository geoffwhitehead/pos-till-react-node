import { Model, Q, tableSchema } from '@nozbe/watermelondb';
import { tableNames } from '.';
import {
  action,
  nochange,
  field,
  readonly,
  date,
  immutableRelation,
  children,
  lazy,
} from '@nozbe/watermelondb/decorators';
import { resolvePrice } from '../helpers';

export const billItemSchema = tableSchema({
  name: 'bill_items',
  columns: [
    { name: 'bill_id', type: 'string', isIndexed: true },
    { name: 'item_id', type: 'string' },
    { name: 'item_name', type: 'string' },
    { name: 'item_price', type: 'number' },
    { name: 'price_group_name', type: 'string' },
    { name: 'price_group_id', type: 'string' },
    // { name: 'modifier_name', type: 'string' },
    // { name: 'modifier_id', type: 'string' },
    { name: 'category_name', type: 'string' },
    { name: 'category_id', type: 'string' },
    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
    { name: 'is_voided', type: 'boolean' },
  ],
});

export class BillItemModel extends Model {
  static table = tableNames.billItems;
  @nochange @field('bill_id') billId;
  @nochange @field('item_id') itemId;
  @nochange @field('item_name') itemName;
  @nochange @field('item_price') itemPrice;
  @nochange @field('price_group_name') priceGroupName;
  @nochange @field('price_group_id') priceGroupId;
  @nochange @field('category_id') categoryId;
  @nochange @field('category_name') categoryName;
  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;
  @field('is_voided') isVoided;

  @immutableRelation(tableNames.bills, 'bill_id') bill;
  @immutableRelation(tableNames.items, 'item_id') item;
  @immutableRelation(tableNames.priceGroups, 'price_group_id') priceGroup;
  @immutableRelation(tableNames.categories, 'category_id') category;

  @children(tableNames.billItemModifierItems) _billItemModifierItems;
  @children(tableNames.billItemModifiers) billItemModifiers;

  @lazy billItemModifierItems = this._billItemModifierItems.extend(Q.where('is_voided', Q.notEq(true)));
  @lazy billItemModifierItemVoids = this._billItemModifierItems.extend(Q.where('is_voided', true));

  @action void = async () => {
    const modifierItemsToVoid = await this.billItemModifierItems.fetch();

    await modifierItemsToVoid.map(async modifierItem => await this.subAction(modifierItem.void));

    await this.update(billItem => {
      billItem.isVoided = true;
    });
  };

  @action addModifierChoices = async (modifier, modifierItems, priceGroup) => {
    const toCreate = [];

    const billItemModifierToCreate = this.collections
      .get(tableNames.billItemModifiers)
      .prepareCreate(billItemModifier => {
        billItemModifier.modifier.set(modifier);
        billItemModifier.billItem.set(this);
        Object.assign(billItemModifier, {
          modifierName: modifier.name,
        });
      });

    const billItemModifierItemsToCreate = await Promise.all(
      await modifierItems.map(async modifierItem => {
        const prices = await modifierItem.prices.fetch();
        const modifier = await modifierItem.modifier.fetch();
        const mItem = this.collections.get(tableNames.billItemModifierItems).prepareCreate(billItemModifierItem => {
          billItemModifierItem.billItem.set(this);
          billItemModifierItem.modifierItem.set(modifierItem);
          billItemModifierItem.billItemModifier.set(billItemModifierToCreate);
          billItemModifierItem.priceGroup.set(priceGroup);
          billItemModifierItem.modifier.set(modifier);
          Object.assign(billItemModifierItem, {
            modifierName: modifier.name,
            modifierItemName: modifierItem.name,
            modifierItemPrice: resolvePrice(priceGroup, prices),
            priceGroupName: priceGroup.name,
            isVoided: false,
            // billItemModifierId: billItemModifierToCreate.id,
          });
        });
        return mItem;
      }),
    );
    toCreate.push(billItemModifierToCreate, ...billItemModifierItemsToCreate);

    await this.database.action(async () => {
      await this.database.batch(...toCreate);
    });
  };

  static associations = {
    [tableNames.bills]: { type: 'belongs_to', key: 'bill_id' },
    [tableNames.items]: { type: 'belongs_to', key: 'item_id' },
    [tableNames.priceGroups]: { type: 'belongs_to', key: 'price_group_id' },
    [tableNames.categories]: { type: 'belongs_to', key: 'category_id' },
    [tableNames.billItemModifierItems]: { type: 'has_many', foreignKey: 'bill_item_id' },
    [tableNames.billItemModifiers]: { type: 'has_many', foreignKey: 'bill_item_id' },
  };
}

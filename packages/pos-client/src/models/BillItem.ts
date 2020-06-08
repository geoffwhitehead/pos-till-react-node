import { Model, Q, tableSchema, Relation, Query } from '@nozbe/watermelondb';
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
import { Bill } from './Bill';
import { Item } from './Item';
import { PriceGroup } from './PriceGroup';
import { Category } from './Category';
import { BillItemModifierItem } from './BillItemModifierItem';
import { BillItemModifier } from './BillItemModifier';
import { Modifier } from './Modifier';
import { ModifierItem } from './ModifierItem';
import { Printer, BillItemPrintLog, tableNames } from '.';
import { BillItemPrintLogStatus } from './BillItemPrintLog';

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
    { name: 'print_status', type: 'string' },
  ],
});

export type PrintStatus = 'success' | 'error' | 'pending';
export class BillItem extends Model {
  static table = 'bill_items';

  @nochange @field('bill_id') billId: string;
  @nochange @field('item_id') itemId: string;
  @nochange @field('item_name') itemName: string;
  @nochange @field('item_price') itemPrice: number;
  @nochange @field('price_group_name') priceGroupName: string;
  @nochange @field('price_group_id') priceGroupId: string;
  @nochange @field('category_id') categoryId: string;
  @nochange @field('category_name') categoryName: string;
  @readonly @date('created_at') createdAt: Date;
  @readonly @date('updated_at') updatedAt: Date;
  @field('is_voided') isVoided: boolean;
  @field('print_status') printStatus: PrintStatus;

  @immutableRelation('bills', 'bill_id') bill: Relation<Bill>;
  @immutableRelation('items', 'item_id') item: Relation<Item>;
  @immutableRelation('price_groups', 'price_group_id') priceGroup: Relation<PriceGroup>;
  @immutableRelation('categories', 'category_id') category: Relation<Category>;

  @children('bill_item_modifier_items') _billItemModifierItems: Query<BillItemModifierItem>;
  @children('bill_item_modifiers') billItemModifiers: Query<BillItemModifier>;

  @lazy billItemModifierItems: Query<BillItemModifierItem> = this._billItemModifierItems.extend(
    Q.where('is_voided', Q.notEq(true)),
  );
  @lazy billItemModifierItemVoids: Query<BillItemModifierItem> = this._billItemModifierItems.extend(
    Q.where('is_voided', true),
  );

  @action void = async () => {
    const modifierItemsToVoid = await this.billItemModifierItems.fetch();

    await modifierItemsToVoid.map(async modifierItem => await this.subAction(modifierItem.void));

    await this.update(billItem => {
      billItem.isVoided = true;
    });
  };

  @action updatePrintStatus = async (printStatus: PrintStatus) => {
    this.printStatus = printStatus;
  };

  @action createPrintLog = async (printer: Printer, status: BillItemPrintLogStatus) => {
    const log = this.database.collections.get<BillItemPrintLog>(tableNames.BillItemPrintLog).create(log => {
      log.billItem.set(this);
      log.printer.set(printer);
      log.status = status
    });

    return log
  };

  @action addModifierChoices = async (modifier: Modifier, modifierItems: ModifierItem[], priceGroup: PriceGroup) => {
    const toCreate = [];

    const billItemModifierToCreate = this.collections
      .get<BillItemModifier>('bill_item_modifiers')
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
        const mItem = this.collections
          .get<BillItemModifierItem>('bill_item_modifier_items')
          .prepareCreate(billItemModifierItem => {
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
    bills: { type: 'belongs_to', key: 'bill_id' },
    items: { type: 'belongs_to', key: 'item_id' },
    price_groups: { type: 'belongs_to', key: 'price_group_id' },
    categories: { type: 'belongs_to', key: 'category_id' },
    bill_item_modifier_items: { type: 'has_many', foreignKey: 'bill_item_id' },
    bill_item_modifiers: { type: 'has_many', foreignKey: 'bill_item_id' },
  };
}

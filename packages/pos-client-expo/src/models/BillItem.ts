import { Model, Query, Relation, tableSchema } from '@nozbe/watermelondb';
import { action, children, date, field, immutableRelation, nochange, readonly } from '@nozbe/watermelondb/decorators';
import dayjs from 'dayjs';
import { BillItemPrintLog, tableNames } from '.';
import { ModifyReason } from '../screens/Checkout/sub-components/Receipt/sub-components/ModalReason';
import { Bill } from './Bill';
import { BillItemModifier } from './BillItemModifier';
import { BillItemModifierItem } from './BillItemModifierItem';
import { PrintStatus, PrintType } from './BillItemPrintLog';
import { Category } from './Category';
import { Item } from './Item';
import { PriceGroup } from './PriceGroup';
import { ASSOCIATION_TYPES } from './constants';

export const billItemSchema = tableSchema({
  name: 'bill_items',
  columns: [
    { name: 'bill_id', type: 'string', isIndexed: true },
    { name: 'item_id', type: 'string' },
    { name: 'item_name', type: 'string' },
    { name: 'item_short_name', type: 'string' },
    { name: 'item_price', type: 'number' },
    { name: 'price_group_name', type: 'string' },
    { name: 'price_group_id', type: 'string' },
    { name: 'category_name', type: 'string' },
    { name: 'category_id', type: 'string' },
    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
    { name: 'is_comp', type: 'boolean' },
    { name: 'is_voided', type: 'boolean' },
    { name: 'voided_at', type: 'string', isOptional: true },
    { name: 'reason_description', type: 'string', isOptional: true },
    { name: 'reason_name', type: 'string', isOptional: true },
    { name: 'is_stored', type: 'boolean' },
    { name: 'stored_at', type: 'string' },
    { name: 'print_message', type: 'string', isOptional: true },
  ],
});

export class BillItem extends Model {
  static table = 'bill_items';

  @nochange @field('bill_id') billId!: string;
  @nochange @field('item_id') itemId!: string;
  @nochange @field('item_name') itemName!: string;
  @nochange @field('item_short_name') itemShortName!: string;
  @nochange @field('item_price') itemPrice!: number;
  @nochange @field('price_group_name') priceGroupName!: string;
  @nochange @field('price_group_id') priceGroupId!: string;
  @nochange @field('category_id') categoryId!: string;
  @nochange @field('category_name') categoryName!: string;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
  @field('is_comp') isComp!: boolean;
  @field('is_voided') isVoided!: boolean;
  @field('voided_at') voidedAt?: string;
  @field('reason_description') reasonDescription?: string;
  @field('reason_name') reasonName?: string;
  @field('is_stored') isStored!: boolean;
  @field('stored_at') storedAt!: string;
  @field('print_message') printMessage?: string;

  @immutableRelation('bills', 'bill_id') bill!: Relation<Bill>;
  @immutableRelation('items', 'item_id') item!: Relation<Item>;
  @immutableRelation('categories', 'category_id') category!: Relation<Category>;
  @immutableRelation('price_groups', 'price_group_id') priceGroup!: Relation<PriceGroup>;

  @children('bill_item_modifiers') billItemModifiers!: Query<BillItemModifier>;
  @children('bill_item_modifier_items') billItemModifierItems!: Query<BillItemModifierItem>;
  @children('bill_item_print_logs') billItemPrintLogs!: Query<BillItemPrintLog>;

  @action async void(values?: ModifyReason) {
    await this.update(billItem => {
      billItem.isVoided = true;
      billItem.reasonDescription = values?.reason || '';
      billItem.reasonName = values?.name || '';
      billItem.voidedAt = new Date().getTime().toString();
    });
  }

  @action async makeComp(values: ModifyReason) {
    await this.update(billItem => {
      billItem.isComp = true;
      billItem.reasonDescription = values.reason;
      billItem.reasonName = values.name;
      // billItem.voidedAt = new Date().getTime().toString();
    });
  }

  static associations = {
    bills: { type: ASSOCIATION_TYPES.BELONGS_TO, key: 'bill_id' },
    items: { type: ASSOCIATION_TYPES.BELONGS_TO, key: 'item_id' },
    price_groups: { type: ASSOCIATION_TYPES.BELONGS_TO, key: 'price_group_id' },
    categories: { type: ASSOCIATION_TYPES.BELONGS_TO, key: 'category_id' },
    bill_item_modifier_items: { type: ASSOCIATION_TYPES.HAS_MANY, foreignKey: 'bill_item_id' },
    bill_item_modifiers: { type: ASSOCIATION_TYPES.HAS_MANY, foreignKey: 'bill_item_id' },
    bill_item_print_logs: { type: ASSOCIATION_TYPES.HAS_MANY, foreignKey: 'bill_item_id' },
  };
}

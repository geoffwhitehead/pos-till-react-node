import { Model, tableSchema } from '@nozbe/watermelondb';
import { tableNames } from '.';
import { action, nochange, field, immutableRelation } from '@nozbe/watermelondb/decorators';

export const billItemModifierItemSchema = tableSchema({
  name: 'bill_item_modifier_items',
  columns: [
    { name: 'bill_item_id', type: 'string', isIndexed: true },
    { name: 'bill_item_modifier_id', type: 'string' },
    { name: 'modifier_id', type: 'string' },
    { name: 'modifier_name', type: 'string' },
    { name: 'modifier_item_id', type: 'string' },
    { name: 'modifier_item_name', type: 'string' },
    { name: 'modifier_item_price', type: 'number' },
    { name: 'price_group_name', type: 'string' },
    { name: 'price_group_id', type: 'string' },
    { name: 'is_voided', type: 'boolean' },
  ],
});

export class BillItemModifierItemModel extends Model {
  static table = tableNames.billItemModifierItems;

  @nochange @field('bill_item_id') billItemId;
  @nochange @field('bill_item_modifier_id') billItemModifierId;
  @nochange @field('modifier_id') modifierId;
  @nochange @field('modifier_name') modifierName;
  @nochange @field('modifier_item_id') modifierItemId;
  @nochange @field('modifier_item_price') modifierItemPrice;
  @nochange @field('modifier_item_name') modifierItemName;
  @nochange @field('price_group_name') priceGroupName;
  @nochange @field('price_group_id') priceGroupId;
  @field('is_voided') isVoided;

  @immutableRelation(tableNames.billItems, 'bill_item_id') billItem;
  @immutableRelation(tableNames.modifierItems, 'modifier_item_id') modifierItem;
  @immutableRelation(tableNames.billItemModifiers, 'bill_item_modifier_id') billItemModifier;
  @immutableRelation(tableNames.priceGroups, 'price_group_id') priceGroup;
  @immutableRelation(tableNames.modifiers, 'modifier_id') modifier;

  static associations = {
    [tableNames.billItems]: { type: 'belongs_to', key: 'bill_item_id' },
    [tableNames.modifierItems]: { type: 'belongs_to', key: 'modifier_item_id' },
    [tableNames.billItemModifiers]: { type: 'belongs_to', key: 'bill_item_modifier_id' },
    [tableNames.modifiers]: { type: 'belongs_to', key: 'modifier_id' },
  };

  @action void = async () =>
    await this.update(modifierItem => {
      modifierItem.isVoided = true;
    });
}

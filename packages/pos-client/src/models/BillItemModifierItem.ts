import { Model, tableSchema } from '@nozbe/watermelondb';
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

export class BillItemModifierItem extends Model {
  static table = 'bill_item_modifier_items';

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

  @immutableRelation('bill_items', 'bill_item_id') billItem;
  @immutableRelation('modifier_items', 'modifier_item_id') modifierItem;
  @immutableRelation('bill_item_modifiers', 'bill_item_modifier_id') billItemModifier;
  @immutableRelation('price_groups', 'price_group_id') priceGroup;
  @immutableRelation('modifiers', 'modifier_id') modifier;

  static associations = {
    bill_items: { type: 'belongs_to', key: 'bill_item_id' },
    modifier_items: { type: 'belongs_to', key: 'modifier_item_id' },
    bill_item_modifiers: { type: 'belongs_to', key: 'bill_item_modifier_id' },
    modifiers: { type: 'belongs_to', key: 'modifier_id' },
  };

  @action void = async () =>
    await this.update(modifierItem => {
      modifierItem.isVoided = true;
    });
}

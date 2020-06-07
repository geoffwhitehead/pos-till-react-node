import { Model, Q, tableSchema } from '@nozbe/watermelondb';
import { nochange, field, immutableRelation, children, lazy } from '@nozbe/watermelondb/decorators';

export const billItemModifierSchema = tableSchema({
  name: 'bill_item_modifiers',
  columns: [
    { name: 'bill_item_id', type: 'string', isIndexed: true },
    { name: 'modifier_name', type: 'string' },
    { name: 'modifier_id', type: 'string' },
  ],
});

export class BillItemModifier extends Model {
  static table = 'bill_item_modifiers';

  @nochange @field('bill_item_id') billItemId;
  @nochange @field('modifier_name') modifierName;
  @nochange @field('modifier_id') modifierId;

  @immutableRelation('modifiers', 'modifier_id') modifier;
  @immutableRelation('bill_items', 'bill_item_id') billItem;

  @children('bill_item_modifier_items') _billItemModifierItems;
  @lazy billItemModifierItems = this._billItemModifierItems.extend(Q.where('is_voided', Q.notEq(true)));
  @lazy billItemModifierItemVoids = this._billItemModifierItems.extend(Q.where('is_voided', true));

  static associations = {
    bill_items: { type: 'belongs_to', key: 'bill_item_id' },
    modifiers: { type: 'belongs_to', key: 'modifier_id' },
    bill_item_modifier_items: { type: 'has_many', key: 'bill_item_modifier_id' },
  };
}

import { Model, Q, Query, Relation, tableSchema } from '@nozbe/watermelondb';
import { children, field, immutableRelation, lazy, nochange } from '@nozbe/watermelondb/decorators';
import { BillItem } from './BillItem';
import { BillItemModifierItem } from './BillItemModifierItem';
import { Modifier } from './Modifier';

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

  @nochange @field('bill_item_id') billItemId: string;
  @nochange @field('modifier_name') modifierName: string;
  @nochange @field('modifier_id') modifierId: string;

  @immutableRelation('modifiers', 'modifier_id') modifier: Relation<Modifier>;
  @immutableRelation('bill_items', 'bill_item_id') billItem: Relation<BillItem>;

  @children('bill_item_modifier_items') _billItemModifierItems: Query<BillItemModifierItem>;

  @lazy billItemModifierItems: Query<BillItemModifierItem> = this._billItemModifierItems.extend(
    Q.where('is_voided', Q.notEq(true)),
  );
  @lazy billItemModifierItemVoids: Query<BillItemModifierItem> = this._billItemModifierItems.extend(
    Q.where('is_voided', true),
  );

  static associations = {
    bill_items: { type: 'belongs_to', key: 'bill_item_id' },
    modifiers: { type: 'belongs_to', key: 'modifier_id' },
    bill_item_modifier_items: { type: 'has_many', key: 'bill_item_modifier_id' },
  };
}

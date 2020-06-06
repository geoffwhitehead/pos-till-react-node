import { Model, Q } from "@nozbe/watermelondb";
import { tableNames } from ".";
import { action, nochange, field, readonly, date, immutableRelation, children, lazy } from "@nozbe/watermelondb/decorators";
import { resolvePrice } from "../helpers";


export class BillItemModifier extends Model {
    static table = tableNames.billItemModifiers;
  
    @nochange @field('bill_item_id') billItemId;
    @nochange @field('modifier_name') modifierName;
    @nochange @field('modifier_id') modifierId;
  
    @immutableRelation(tableNames.modifiers, 'modifier_id') modifier;
    @immutableRelation(tableNames.billItems, 'bill_item_id') billItem;
  
    @children(tableNames.billItemModifierItems) _billItemModifierItems;
    @lazy billItemModifierItems = this._billItemModifierItems.extend(Q.where('is_voided', Q.notEq(true)));
    @lazy billItemModifierItemVoids = this._billItemModifierItems.extend(Q.where('is_voided', true));
  
    static associations = {
      [tableNames.billItems]: { type: 'belongs_to', key: 'bill_item_id' },
      [tableNames.modifiers]: { type: 'belongs_to', key: 'modifier_id' },
      [tableNames.billItemModifierItems]: { type: 'has_many', key: 'bill_item_modifier_id' },
    };
  }
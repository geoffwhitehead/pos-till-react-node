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
import { PrintStatus, PrintType } from './BillItemPrintLog';
import dayjs, { Dayjs } from 'dayjs';
import { ModifyReason } from '../screens/Checkout/sub-components/Receipt/sub-components/ModalReason';

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
    // { name: 'modifier_name', type: 'string' },
    // { name: 'modifier_id', type: 'string' },
    { name: 'category_name', type: 'string' },
    { name: 'category_id', type: 'string' },
    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
    { name: 'is_comp', type: 'boolean' },
    { name: 'is_voided', type: 'boolean' },
    { name: 'voided_at', type: 'string' },
    { name: 'reason_description', type: 'string' },
    { name: 'reason_name', type: 'string' },
    { name: 'is_stored', type: 'boolean' },
    { name: 'stored_at', type: 'string' },
    /**
     * Ideally print_status would be computed from the print logs and void logs but im not sure how performant this
     * will be using the watermelon query builder.
     */
    { name: 'print_status', type: 'string' },
  ],
});

export class BillItem extends Model {
  static table = 'bill_items';

  @nochange @field('bill_id') billId: string;
  @nochange @field('item_id') itemId: string;
  @nochange @field('item_name') itemName: string;
  @nochange @field('item_short_name') itemShortName: string;
  @nochange @field('item_price') itemPrice: number;
  @nochange @field('price_group_name') priceGroupName: string;
  @nochange @field('price_group_id') priceGroupId: string;
  @nochange @field('category_id') categoryId: string;
  @nochange @field('category_name') categoryName: string;
  @readonly @date('created_at') createdAt: Date;
  @readonly @date('updated_at') updatedAt: Date;
  @field('is_comp') isComp: boolean;
  @field('is_stored') isStored: boolean;
  @field('stored_at') storedAt: string;
  @field('is_voided') isVoided: boolean;
  @field('voided_at') voidedAt: string;
  @field('reason_description') reasonDescription: string;
  @field('reason_name') reasonName: string;

  @immutableRelation('bills', 'bill_id') bill: Relation<Bill>;
  @immutableRelation('items', 'item_id') item: Relation<Item>;
  @immutableRelation('price_groups', 'price_group_id') priceGroup: Relation<PriceGroup>;
  @immutableRelation('categories', 'category_id') category: Relation<Category>;

  @children('bill_item_modifier_items') billItemModifierItems: Query<BillItemModifierItem>;
  @children('bill_item_modifiers') billItemModifiers: Query<BillItemModifier>;
  @children('bill_item_print_logs') billItemPrintLogs: Query<BillItemPrintLog>;

  @action void = async (values?: ModifyReason) => {
    const [modifierItemsToVoid, billItemPrintLogs] = await Promise.all([
      this.billItemModifierItems.fetch(),
      this.billItemPrintLogs.fetch(),
    ]);

    const modifierItemsToUpdate = modifierItemsToVoid.map(modItem =>
      modItem.prepareUpdate(mItem => {
        mItem.isVoided = true; // TODO: refactor - not sure this is needed
      }),
    );

    const billItemToUpdate = this.prepareUpdate(bItem => {
      bItem.isVoided = true;
      bItem.voidedAt = dayjs().toISOString();
      if (values?.reason) {
        bItem.reasonDescription = values.reason;
        bItem.reasonName = values.name;
      }
    });

    const arrNotifiableLogs = [PrintStatus.errored, PrintStatus.processing, PrintStatus.succeeded];
    const arrNonNotifiableLogs = [PrintStatus.pending]; // TODO: might need cancelled aswell

    const notifiableLogs = billItemPrintLogs.filter(log => arrNotifiableLogs.includes(log.status));
    const nonNotifiableLogs = billItemPrintLogs.filter(log => arrNonNotifiableLogs.includes(log.status));

    /**
     * A voided item will have existing print logs created for it. Depending on whether this item has already been stored
     * they may have different states. All pending logs should be deleted and all processed or processed will need a void log creating
     * to send to the printer.
     */

    const printLogsToCreate = notifiableLogs.map(({ printerId }) => {
      return this.collections.get<BillItemPrintLog>(tableNames.billItemPrintLogs).prepareCreate(record => {
        record.billItem.set(this);
        record.printerId = printerId;
        record.status = PrintStatus.pending;
        record.type = PrintType.void;
      });
    });

    const printLogsToDelete = nonNotifiableLogs.map(log => log.prepareDestroyPermanently());
    const batched = [...modifierItemsToUpdate, billItemToUpdate, ...printLogsToCreate, ...printLogsToDelete];
    await this.database.batch(...batched);
  };

  @action makeComp = async (values: ModifyReason) => {
    const modifierItemsToComp = await this.billItemModifierItems.fetch();

    const billItemUpdate = this.prepareUpdate(billItem => {
      billItem.isComp = true;
      if (values?.reason) {
        billItem.reasonName = values.name;
        billItem.reasonDescription = values.reason;
      }
    });

    const modsToUpdate = modifierItemsToComp.map(mI =>
      mI.prepareUpdate(modifierItem => {
        modifierItem.isComp = true;
      }),
    );

    await this.database.batch(billItemUpdate, ...modsToUpdate);
  };

  // @action voidNoPrint = async (reason: string = '') => {
  //   const [modifierItemsToVoid, billItemPrintLogs] = await Promise.all([
  //     this.billItemModifierItems.fetch(),
  //     this.billItemPrintLogs.fetch(),
  //   ]);

  //   const modifierItemsToUpdate = modifierItemsToVoid.map(modItem =>
  //     modItem.prepareUpdate(mItem => {
  //       mItem.isVoided = true;
  //     }),
  //   );

  //   const printLogsToUpdate = billItemPrintLogs.map(billItemPrintLog =>
  //     billItemPrintLog.prepareUpdate(record => (record.status = PrintStatus.cancelled)),
  //   );

  //   const billItemToUpdate = this.prepareUpdate(bItem => {
  //     bItem.isVoided = true;
  //     bItem.voidedAt = dayjs().toISOString();
  //     bItem.removedReason = reason;
  //   });

  //   const batched = [...modifierItemsToUpdate, billItemToUpdate, ...printLogsToUpdate];
  //   await this.database.batch(...batched);
  // };

  static associations = {
    bills: { type: 'belongs_to', key: 'bill_id' },
    items: { type: 'belongs_to', key: 'item_id' },
    price_groups: { type: 'belongs_to', key: 'price_group_id' },
    categories: { type: 'belongs_to', key: 'category_id' },
    bill_item_modifier_items: { type: 'has_many', foreignKey: 'bill_item_id' },
    bill_item_modifiers: { type: 'has_many', foreignKey: 'bill_item_id' },
    bill_item_print_logs: { type: 'has_many', foreignKey: 'bill_item_id' },
  };
}

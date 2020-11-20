import { Model, Q, Query, Relation, tableSchema } from '@nozbe/watermelondb';
import {
  action,
  children,
  date,
  field,
  immutableRelation,
  lazy,
  nochange,
  readonly,
} from '@nozbe/watermelondb/decorators';
import dayjs from 'dayjs';
import { flatten, times } from 'lodash';
import {
  BillCallPrintLog,
  BillItemModifier,
  BillItemPrintLog,
  Discount,
  Item,
  Modifier,
  ModifierItem,
  PaymentType,
  PriceGroup,
  tableNames,
} from '.';
import { resolvePrice } from '../helpers';
import { BillCallLog } from './BillCallLog';
import { BillDiscount } from './BillDiscount';
import { BillItem } from './BillItem';
import { BillItemModifierItem } from './BillItemModifierItem';
import { PrintStatus } from './BillItemPrintLog';
import { BillPayment } from './BillPayment';
import { BillPeriod } from './BillPeriod';

export const billSchema = tableSchema({
  name: 'bills',
  columns: [
    { name: 'reference', type: 'number' },
    { name: 'is_closed', type: 'boolean' },
    { name: 'bill_period_id', type: 'string', isIndexed: true },
    { name: 'closed_at', type: 'number', isOptional: true },
    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
    { name: 'prep_at', type: 'number', isOptional: true },
  ],
});

type SelectedModifier = {
  modifier: Modifier;
  items: ModifierItem[];
};

export class Bill extends Model {
  static table = 'bills';

  @field('reference') reference: number;
  @field('is_closed') isClosed: boolean;
  @nochange @field('bill_period_id') billPeriodId: string;
  @date('closed_at') closedAt: Date;
  @date('prep_at') prepAt: Date;

  @readonly @date('created_at') createdAt: string;
  @readonly @date('updated_at') updatedAt: string;

  @immutableRelation('bill_periods', 'bill_period_id') billPeriod: Relation<BillPeriod>;

  static associations = {
    bill_periods: { type: 'belongs_to', key: 'bill_period_id' },
    bill_payments: { type: 'has_many', foreignKey: 'bill_id' },
    bill_items: { type: 'has_many', foreignKey: 'bill_id' },
    bill_discounts: { type: 'has_many', foreignKey: 'bill_id' },
    bill_call_logs: { type: 'has_many', foreignKey: 'bill_id' },
  };

  @children('bill_payments') billPayments: Query<BillPayment>;
  @children('bill_discounts') billDiscounts: Query<BillDiscount>;
  @children('bill_items') billItems: Query<BillItem>;
  @children('bill_call_logs') billCallLogs: Query<BillCallLog>;

  @lazy _billModifierItems = this.collections
    .get<BillItemModifierItem>('bill_item_modifier_items')
    .query(Q.on('bill_items', 'bill_id', this.id)) as Query<BillItemModifierItem>;

  @lazy assignedPriceGroups = this.collections
    .get<PriceGroup>(tableNames.priceGroups)
    .query(Q.on(tableNames.billItems, 'bill_id', this.id));

  @lazy billCallPrintLogs = this.collections
    .get<BillCallPrintLog>(tableNames.billCallPrintLogs)
    .query(Q.on(tableNames.billItems, 'bill_id', this.id));

  /**
   * Why are comps included? Because the reporting will need to account for these items when creating purchase reports.
   */
  @lazy billModifierItems: Query<BillItemModifierItem> = this._billModifierItems.extend(
    Q.where('is_voided', Q.notEq(true)),
  );

  @lazy billModifierItemVoids: Query<BillItemModifierItem> = this._billModifierItems.extend(
    Q.where('is_voided', Q.eq(true)),
  );

  @lazy chargableBillItems = this.billItems.extend(
    Q.and(Q.where('is_voided', Q.notEq(true)), Q.where('is_comp', Q.notEq(true))),
  );

  //
  @lazy itemsRequiringPrepTimeCount = this.billItems.extend(Q.where('is_voided', Q.notEq(true))).observeCount();
  @lazy priceGroups = this.database.collections
    .get<PriceGroup>(tableNames.priceGroups)
    .query(Q.on(tableNames.billItems, [Q.where('bill_id', this.id), Q.where('is_voided', Q.notEq(true))]));

  @lazy billItemsExclVoids = this.billItems.extend(Q.where('is_voided', Q.notEq(true)));
  @lazy chargableBillItemModifierItems = this._billModifierItems.extend(
    Q.and(Q.where('is_voided', Q.notEq(true)), Q.where('is_comp', Q.notEq(true))),
  );

  @lazy overviewPrintLogs: Query<BillItemPrintLog> = this.collections
    .get<BillItemPrintLog>(tableNames.billItemPrintLogs)
    .query(
      Q.experimentalJoinTables([tableNames.billItems]),
      Q.where('status', Q.oneOf([PrintStatus.pending, PrintStatus.errored, PrintStatus.processing])),
      Q.on(tableNames.billItems, 'bill_id', this.id),
    );

  @lazy billItemStatusLogs: Query<BillItemPrintLog> = this.collections
    .get<BillItemPrintLog>(tableNames.billItemPrintLogs)
    .query(
      Q.experimentalJoinTables([tableNames.billItems]),
      Q.where(
        'status',
        Q.oneOf([PrintStatus.succeeded, PrintStatus.errored, PrintStatus.processing, PrintStatus.pending]),
      ),
      Q.on(tableNames.billItems, 'bill_id', this.id),
    );

  @lazy toPrintBillLogs: Query<BillItemPrintLog> = this.collections
    .get<BillItemPrintLog>(tableNames.billItemPrintLogs)
    .query(
      Q.experimentalJoinTables([tableNames.billItems]),
      Q.where('status', Q.oneOf([PrintStatus.pending, PrintStatus.errored])),
      Q.on(tableNames.billItems, 'bill_id', this.id),
    );

  @lazy toPrintBillCallPrintLogs: Query<BillCallPrintLog> = this.collections
    .get<BillCallPrintLog>(tableNames.billCallPrintLogs)
    .query(
      Q.experimentalJoinTables([tableNames.billCallLogs]),
      Q.where('status', Q.oneOf([PrintStatus.pending, PrintStatus.errored])),
      Q.on(tableNames.billCallLogs, 'bill_id', this.id),
    );

  @lazy overviewBillCallPrintLogs: Query<BillCallPrintLog> = this.collections
    .get<BillCallPrintLog>(tableNames.billCallPrintLogs)
    .query(
      Q.experimentalJoinTables([tableNames.billCallLogs]),
      Q.where(
        'status',
        Q.oneOf([PrintStatus.pending, PrintStatus.processing, PrintStatus.errored, PrintStatus.succeeded]),
      ),
      Q.on(tableNames.billCallLogs, 'bill_id', this.id),
    );

  @lazy incompleteBillCallPrintLogs: Query<BillCallPrintLog> = this.collections
    .get<BillCallPrintLog>(tableNames.billCallPrintLogs)
    .query(
      Q.experimentalJoinTables([tableNames.billCallLogs]),
      Q.where('status', Q.oneOf([PrintStatus.pending, PrintStatus.processing, PrintStatus.errored])),
      Q.on(tableNames.billCallLogs, 'bill_id', this.id),
    );

  /**
   * Note: these 2 queries are mainly used in the period report. Once nested joins are available with watermelon
   * they can be moved to the periodReport model to improve performance.
   */
  @lazy billModifierItemVoids: Query<BillItemModifierItem> = this._billModifierItems.extend(Q.where('is_voided', true));
  @lazy billModifierItemComps: Query<BillItemModifierItem> = this._billModifierItems.extend(
    Q.and(Q.where('is_comp', Q.eq(true)), Q.where('is_voided', Q.notEq(true))),
  );

  @action addPayment = async (p: { paymentType: PaymentType; amount: number; isChange?: boolean }) => {
    const { paymentType, amount, isChange } = p;
    await this.collections.get<BillPayment>('bill_payments').create(payment => {
      payment.paymentType.set(paymentType);
      payment.bill.set(this);
      Object.assign(payment, {
        amount,
        isChange: isChange || false,
      });
    });
  };

  @action addDiscount = async (p: { discount: Discount }) => {
    await this.collections.get<BillDiscount>('bill_discounts').create(discount => {
      discount.bill.set(this);
      discount.discount.set(p.discount);
    });
  };

  @action addItems = async (p: {
    item: Item;
    priceGroup: PriceGroup;
    quantity: number;
    selectedModifiers: SelectedModifier[];
  }): Promise<void> => {
    const { item, priceGroup, quantity, selectedModifiers } = p;

    const [category, prices, printers] = await Promise.all([
      item.category.fetch(),
      item.prices.fetch(),
      item.printers.fetch(),
    ]);

    const createBillItem = () =>
      this.collections.get<BillItem>('bill_items').prepareCreate(billItem => {
        billItem.bill.set(this);
        billItem.priceGroup.set(priceGroup);
        billItem.category.set(category);
        billItem.item.set(item);
        Object.assign(billItem, {
          itemName: item.name,
          itemShortName: item.shortName,
          itemPrice: resolvePrice(priceGroup, prices),
          priceGroupName: priceGroup.name,
          categoryName: category.name,
        });
      });

    const createPrintLogs = (billItem: BillItem): BillItemPrintLog[] => {
      return printers.map(printer => {
        return this.collections.get<BillItemPrintLog>(tableNames.billItemPrintLogs).prepareCreate(record => {
          record.billItem.set(billItem);
          record.printer.set(printer);
          record.bill.set(this);
          Object.assign(record, {
            status: PrintStatus.pending,
          });
        });
      });
    };

    const billItemsToCreate = times(quantity, createBillItem);

    const _printLogsToCreate = billItemsToCreate.map(createPrintLogs);

    const printLogsToCreate = flatten(_printLogsToCreate);

    // for each item hit this function
    const createModifiers = async (billItem: BillItem, selectedModifiers: SelectedModifier[]) => {
      const modifiersToCreate = await Promise.all(
        selectedModifiers.map(async ({ modifier, items: modifierItems }) => {
          const billItemModifierToCreate = this.collections
            .get<BillItemModifier>(tableNames.billItemModifiers)
            .prepareCreate(billItemModifier => {
              billItemModifier.modifier.set(modifier);
              billItemModifier.billItem.set(billItem);
              Object.assign(billItemModifier, {
                modifierName: modifier.name,
              });
            });

          const billItemModifierItemsToCreate = await Promise.all(
            modifierItems.map(async modifierItem => {
              const [prices, modifier] = await Promise.all([
                modifierItem.prices.fetch(),
                modifierItem.modifier.fetch(),
              ]);

              const mItem = this.collections
                .get<BillItemModifierItem>(tableNames.billItemModifierItems)
                .prepareCreate(billItemModifierItem => {
                  billItemModifierItem.billItem.set(billItem);
                  billItemModifierItem.modifierItem.set(modifierItem);
                  billItemModifierItem.billItemModifier.set(billItemModifierToCreate);
                  billItemModifierItem.priceGroup.set(priceGroup);
                  billItemModifierItem.modifier.set(modifier);
                  Object.assign(billItemModifierItem, {
                    modifierName: modifier.name,
                    modifierItemName: modifierItem.name,
                    modifierItemShortName: modifierItem.shortName,
                    modifierItemPrice: resolvePrice(priceGroup, prices),
                    priceGroupName: priceGroup.name,
                    isVoided: false,
                  });
                });
              return mItem;
            }),
          );
          return [billItemModifierToCreate, ...billItemModifierItemsToCreate];
        }),
      );
      return flatten(modifiersToCreate);
    };

    const billItemModifiersToCreateGroups = await Promise.all(
      billItemsToCreate.map(billItemToCreate => createModifiers(billItemToCreate, selectedModifiers)),
    );

    const billItemModifiersToCreate = flatten(billItemModifiersToCreateGroups);
    const toCreate = [...billItemsToCreate, ...billItemModifiersToCreate, ...printLogsToCreate];

    await this.database.batch(...toCreate);
  };

  /**
   * Find all bill items that are storable and update their stored status
   */
  @action storeBill = async () => {
    // is_stored is not set on removed items to distinguish between cancelled and voided items
    const billItemsToStore = await this.billItems
      .extend(Q.and(Q.where('is_voided', Q.notEq(true))), Q.where('is_stored', Q.notEq(true)))
      .fetch();

    // update on all bill records, dont set voided items to stored. TODO: look at refactoring this so not using is_stored to determine.
    const billItemsToUpdate = billItemsToStore.map(billItem =>
      billItem.prepareUpdate(record => {
        record.isStored = true;
        record.storedAt = dayjs().toISOString();
      }),
    );

    await this.database.batch(...billItemsToUpdate);
  };

  @action close = async () =>
    await this.update(bill => {
      bill.isClosed = true;
      bill.closedAt = dayjs().toDate();
    });

  @action processPrintLogs = async (updates: { billItemPrintLog: BillItemPrintLog; status: PrintStatus }[]) => {
    const printLogsToUpdate = updates.map(({ billItemPrintLog, status }) =>
      billItemPrintLog.prepareUpdate(record => {
        record.status = status;
      }),
    );

    if (printLogsToUpdate.length > 0) {
      await this.database.batch(...printLogsToUpdate);
    }
  };

  @action processCallLogs = async (updates: { billCallPrintLog: BillCallPrintLog; status: PrintStatus }[]) => {
    const printLogsToUpdate = updates.map(({ billCallPrintLog, status }) =>
      billCallPrintLog.prepareUpdate(record => {
        record.status = status;
      }),
    );

    console.log('printLogsToUpdate', printLogsToUpdate);
    if (printLogsToUpdate.length > 0) {
      await this.database.batch(...printLogsToUpdate);
    }
  };
}

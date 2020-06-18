import { Model, Q, tableSchema, Relation, Query } from '@nozbe/watermelondb';
import {
  field,
  nochange,
  date,
  readonly,
  immutableRelation,
  children,
  lazy,
  action,
} from '@nozbe/watermelondb/decorators';
import { resolvePrice } from '../helpers';
import dayjs from 'dayjs';
import { BillItem } from './BillItem';
import { BillPeriod } from './BillPeriod';
import { BillPayment } from './BillPayment';
import { BillDiscount } from './BillDiscount';
import { BillItemModifierItem } from './BillItemModifierItem';
import { PaymentType, Item, PriceGroup, Discount } from '.';

export const billSchema = tableSchema({
  name: 'bills',
  columns: [
    { name: 'reference', type: 'number' },
    { name: 'is_closed', type: 'boolean' },
    { name: 'bill_period_id', type: 'string', isIndexed: true },
    { name: 'closed_at', type: 'number', isOptional: true },
    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
  ],
});

export class Bill extends Model {
  static table = 'bills';

  @field('reference') reference: number;
  @field('is_closed') isClosed: boolean;
  @nochange @field('bill_period_id') billPeriodId: string;
  @date('closed_at') closedAt: Date;

  @readonly @date('created_at') createdAt: string;
  @readonly @date('updated_at') updatedAt: string;

  @immutableRelation('bill_periods', 'bill_period_id') billPeriod: Relation<BillPeriod>;

  static associations = {
    bill_periods: { type: 'belongs_to', key: 'bill_period_id' },
    bill_payments: { type: 'has_many', foreignKey: 'bill_id' },
    bill_items: { type: 'has_many', foreignKey: 'bill_id' },
    bill_discounts: { type: 'has_many', foreignKey: 'bill_id' },
  };

  @children('bill_payments') billPayments: Query<BillPayment>;
  @children('bill_discounts') billDiscounts: Query<BillDiscount>;
  @children('bill_items') _billItems: Query<BillItem>;

  @lazy billItems: Query<BillItem> = this._billItems.extend(Q.where('is_voided', Q.notEq(true)));
  @lazy billItemsNoComp: Query<BillItem> = this.billItems.extend(Q.where('is_comp', Q.notEq(true)));
  @lazy billItemsPrintErrors: Query<BillItem> = this._billItems.extend(Q.where('print_status', 'error'));
  @lazy billItemsNotStored: Query<BillItem> = this._billItems.extend(Q.where('print_status', null));
  @lazy billItemVoids: Query<BillItem> = this._billItems.extend(Q.where('is_voided', true));
  @lazy _billModifierItems = this.collections
    .get<BillItemModifierItem>('bill_item_modifier_items')
    .query(Q.on('bill_items', 'bill_id', this.id)) as Query<BillItemModifierItem>;
  @lazy billModifierItems: Query<BillItemModifierItem> = this._billModifierItems.extend(
    Q.where('is_voided', Q.notEq(true)),
  );
  @lazy billItemsIncPendingVoids: Query<BillItem> = this._billItems.extend(
    Q.or(
      Q.where('is_voided', Q.notEq(true)),
      Q.where('print_status', 'void'),
      Q.where('print_status', 'void_pending'),
      Q.where('print_status', 'void_error'),
    ),
  );


  /**
   * TODO: look at refactoring these queries
   */
  @lazy billItemsVoidsStatusUnstored: Query<BillItem> = this.billItemsIncPendingVoids.extend(
    Q.or(Q.where('print_status', ''), Q.where('print_status', 'void')),
  );

  @lazy billItemsVoidsStatusErrors: Query<BillItem> = this.billItemsIncPendingVoids.extend(
    Q.or(Q.where('print_status', 'error'), Q.where('print_status', 'void_error')),
  );

  @lazy billItemsVoidsStatusPending: Query<BillItem> = this.billItemsIncPendingVoids.extend(
    Q.or(Q.where('print_status', 'pending'), Q.where('print_status', 'void_pending')),
  );

  @lazy billModifierItemVoids: Query<BillItemModifierItem> = this._billModifierItems.extend(Q.where('is_voided', true));

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

  @action addItem = async (p: { item: Item; priceGroup: PriceGroup }): Promise<BillItem> => {
    const { item, priceGroup } = p;

    const x = await item.printers.fetch();
    const [category, prices, printers] = await Promise.all([
      item.category.fetch(),
      item.prices.fetch(),
      item.printers.fetch(),
    ]);

    const newItem = await this.database.action<BillItem>(() =>
      this.collections.get<BillItem>('bill_items').create(billItem => {
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
          printStatus: printers.length ? '' : 'success',
        });
      }),
    );

    return newItem;
  };

  @action close = async () =>
    await this.update(bill => {
      bill.isClosed = true;
      bill.closedAt = dayjs().toDate();
    });
}

import { Model, Q, tableSchema, Query } from '@nozbe/watermelondb';
import { readonly, date, children, lazy, action } from '@nozbe/watermelondb/decorators';
import dayjs from 'dayjs';
import { Bill } from './Bill';
import { BillItem } from './BillItem';
import { Discount } from './Discount';
import { BillPayment } from './BillPayment';

export const billPeriodSchema = tableSchema({
  name: 'bill_periods',
  columns: [
    { name: 'created_at', type: 'number' },
    { name: 'closed_at', type: 'number', isOptional: true },
  ],
});

export class BillPeriod extends Model {
  static table = 'bill_periods';

  @readonly @date('created_at') createdAt: Date;
  @date('closed_at') closedAt: Date;

  static associations = {
    bills: { type: 'has_many', foreignKey: 'bill_period_id' },
  };

  @children('bills') bills: Query<Bill>;

  @lazy openBills: Query<Bill> = this.bills.extend(Q.where('is_closed', Q.notEq(true)));
  @lazy closedBills: Query<Bill> = this.bills.extend(Q.where('is_closed', Q.eq(true)));

  /**
   * if you use following queries on an open period it will include any items / discounts etc that
   * currently pending in a sale.
   */

  @lazy _periodItems = this.collections
    .get('bill_items')
    .query(Q.on('bills', 'bill_period_id', this.id)) as Query<BillItem>;
  @lazy periodItems: Query<BillItem> = this._periodItems.extend(Q.where('is_voided', Q.notEq(true)));
  @lazy periodItemVoids: Query<BillItem> = this._periodItems.extend(Q.where('is_voided', Q.eq(true)));
  @lazy periodDiscounts = this.collections
    .get('bill_discounts')
    .query(Q.on('bills', 'bill_period_id', this.id)) as Query<Discount>;
  @lazy periodPayments = this.collections
    .get('bill_payments')
    .query(Q.on('bills', 'bill_period_id', this.id)) as Query<BillPayment>;

  @action createBill = async (params: { reference: number }): Promise<Bill> => {
    console.log('params', params)
    const b = await this.collections.get<Bill>('bills').create(bill => {
      bill.reference = params.reference;
      bill.isClosed = false;
      bill.billPeriodId = this.id;
    });
    return b;
  };

  @action closePeriod = async () => {
    this.update(billPeriod => {
      billPeriod.closedAt = dayjs().toDate();
    });
  };
}

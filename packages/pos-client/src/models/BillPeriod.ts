import { Model, Q } from '@nozbe/watermelondb';
import { tableNames } from '.';
import { readonly, date, children, lazy, action } from '@nozbe/watermelondb/decorators';
import dayjs from 'dayjs';

export class BillPeriod extends Model {
  static table = tableNames.billPeriods;

  @readonly @date('created_at') createdAt;
  @date('closed_at') closedAt;

  static associations = {
    [tableNames.bills]: { type: 'has_many', foreignKey: 'bill_period_id' },
  };

  @children(tableNames.bills) bills;

  @lazy openBills = this.bills.extend(Q.where('is_closed', Q.notEq(true)));
  @lazy closedBills = this.bills.extend(Q.where('is_closed', Q.eq(true)));

  /**
   * if you use following queries on an open period it will include any items / discounts etc that
   * currently pending in a sale.
   */

  @lazy _periodItems = this.collections.get(tableNames.billItems).query(Q.on(tableNames.bills, 'bill_period_id', this.id));
  @lazy periodItems = this._periodItems.extend(Q.where('is_voided', Q.notEq(true)));
  @lazy periodItemVoids = this._periodItems.extend(Q.where('is_voided', Q.eq(true)));
  @lazy periodDiscounts = this.collections
    .get(tableNames.billDiscounts)
    .query(Q.on(tableNames.bills, 'bill_period_id', this.id));
  @lazy periodPayments = this.collections.get(tableNames.billPayments).query(Q.on(tableNames.bills, 'bill_period_id', this.id));

  @action createBill = async (params: { reference: number }) => {
    return this.collections.get(tableNames.bills).create(bill => {
      bill.reference = params.reference;
      bill.isClosed = false;
      bill.billPeriodId = this.id;
    });
  };

  @action closePeriod = async () => {
    this.update(billPeriod => {
      billPeriod.closedAt = dayjs();
    });
  };
}

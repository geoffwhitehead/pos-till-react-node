import { Model, Q, Query, tableSchema } from '@nozbe/watermelondb';
import { action, children, date, lazy, readonly } from '@nozbe/watermelondb/decorators';
import dayjs from 'dayjs';
import { BillDiscount, Organization, tableNames } from '.';
import { Bill } from './Bill';
import { BillItem } from './BillItem';
import { BillPayment } from './BillPayment';
import { ASSOCIATION_TYPES } from './constants';

export const billPeriodSchema = tableSchema({
  name: 'bill_periods',
  columns: [
    { name: 'created_at', type: 'number' },
    { name: 'closed_at', type: 'number', isOptional: true },
  ],
});

export class BillPeriod extends Model {
  static table = 'bill_periods';

  static associations = {
    bills: { type: ASSOCIATION_TYPES.HAS_MANY, foreignKey: 'bill_period_id' },
  };

  @readonly @date('created_at') createdAt!: Date;
  @date('closed_at') closedAt?: Date;

  @children('bills') bills!: Query<Bill>;

  @lazy openBills: Query<Bill> = this.bills.extend(Q.where('is_closed', Q.notEq(true)));
  @lazy closedBills: Query<Bill> = this.bills.extend(Q.where('is_closed', Q.eq(true)));

  /**
   * if you use following queries on an open period it will include any items / discounts etc that
   * currently pending in a sale.
   */

  @lazy _periodItems = this.collections.get('bill_items').query(Q.on('bills', 'bill_period_id', this.id));
  @lazy periodItems = this._periodItems.extend(Q.where('is_voided', Q.notEq(true)));
  @lazy chargablePeriodItems = this._periodItems.extend(
    Q.and(Q.where('is_comp', Q.notEq(true)), Q.where('is_voided', Q.notEq(true))),
  );
  @lazy periodItemVoidsAndCancels = this._periodItems.extend(Q.where('is_voided', Q.eq(true)));
  @lazy periodItemComps = this._periodItems.extend(
    Q.and(Q.where('is_comp', Q.eq(true)), Q.where('is_voided', Q.notEq(true))),
  );
  @lazy periodDiscounts = this.collections
    .get('bill_discounts')
    .query(Q.on('bills', 'bill_period_id', this.id));
  @lazy periodPayments = this.collections.get('bill_payments').query(Q.on('bills', 'bill_period_id', this.id))

  @action async createBill(params: { reference: number }): Promise<Bill> {
    const bill = await this.collections.get<Bill>(tableNames.bills).create(bill => {
      bill.billPeriod.set(this);
      bill.reference = params.reference;
    });
    return bill;
  }

  @action async closePeriod(organization: Organization) {
    await this.update(record => {
      record.closedAt = new Date();
    });
    await organization.createNewBillPeriod();
  }
}

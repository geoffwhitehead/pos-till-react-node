import { Model, Q, Query, tableSchema } from '@nozbe/watermelondb';
import { action, children, date, lazy, readonly } from '@nozbe/watermelondb/decorators';
import dayjs from 'dayjs';
import { Organization, tableNames } from '.';
import { Bill } from './Bill';
import { BillItem } from './BillItem';
import { BillPayment } from './BillPayment';
import { Discount } from './Discount';

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

  @lazy _periodItems = this.collections.get('bill_items').query(Q.on('bills', 'bill_period_id', this.id)) as Query<
    BillItem
  >;
  @lazy periodItems: Query<BillItem> = this._periodItems.extend(Q.where('is_voided', Q.notEq(true)));
  @lazy chargablePeriodItems: Query<BillItem> = this._periodItems.extend(
    Q.and(Q.where('is_comp', Q.notEq(true)), Q.where('is_voided', Q.notEq(true))),
  );
  @lazy periodItemVoidsAndCancels: Query<BillItem> = this._periodItems.extend(Q.where('is_voided', Q.eq(true)));
  @lazy periodItemComps: Query<BillItem> = this._periodItems.extend(
    Q.and(Q.where('is_comp', Q.eq(true)), Q.where('is_voided', Q.notEq(true))),
  );
  @lazy periodDiscounts = this.collections
    .get('bill_discounts')
    .query(Q.on('bills', 'bill_period_id', this.id)) as Query<Discount>;
  @lazy periodPayments = this.collections.get('bill_payments').query(Q.on('bills', 'bill_period_id', this.id)) as Query<
    BillPayment
  >;

  @action createBill = async (params: { reference: number }): Promise<Bill> => {
    return this.database.action<Bill>(async () => {
      const bill = await this.collections.get<Bill>('bills').create(bill => {
        bill.reference = params.reference;
        bill.isClosed = false;
        bill.billPeriodId = this.id;
      });
      return bill;
    });
  };

  @action closePeriod = async (organization: Organization) => {
    const updateBillPeriod = this.prepareUpdate(billPeriod => {
      billPeriod.closedAt = dayjs().toDate();
    });

    const newBillPeriod = this.database.collections.get<BillPeriod>(tableNames.billPeriods).prepareCreate();
    const orgUpdate = organization.prepareUpdate(org => {
      org.currentBillPeriod.set(newBillPeriod);
    });
    const updates = [updateBillPeriod, newBillPeriod, orgUpdate];

    await this.database.batch(...updates);
  };
}

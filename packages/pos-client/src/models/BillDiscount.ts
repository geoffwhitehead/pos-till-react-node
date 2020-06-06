import { Model, tableSchema } from '@nozbe/watermelondb';
import { nochange, field, readonly, date, immutableRelation, action } from '@nozbe/watermelondb/decorators';

export const billDiscountSchema = tableSchema({
  name: 'bill_discounts',
  columns: [
    { name: 'bill_id', type: 'string', isIndexed: true },
    { name: 'discount_id', type: 'string' },
    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
    { name: 'closing_amount', type: 'number' },
  ],
});

export class BillDiscountModel extends Model {
  static table = 'bill_discounts';

  @nochange @field('bill_id') billId;
  @nochange @field('discount_id') discountId;
  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;
  @field('closing_amount') closingAmount;

  @immutableRelation('bills', 'bill_id') bill;
  @immutableRelation('discounts', 'discount_id') discount;

  static associations = {
    bills: { type: 'belongs_to', key: 'bill_id' },
    discounts: { type: 'belongs_to', key: 'discount_id' },
  };

  @action void = async () => await this.destroyPermanently();

  /**
   * for reporting purposes: on close record the final discount amount.
   * If this isn't done its quite a lot of work to recalcuate discounts
   * when working large amounts of bills in reports
   */

  @action finalize = async (amt: number) =>
    await this.update(billDiscount => {
      billDiscount.closingAmount = amt;
    });
}

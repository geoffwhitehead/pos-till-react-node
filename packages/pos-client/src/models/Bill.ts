import { Model, Q } from '@nozbe/watermelondb';
import { tableNames } from '.';
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

export class Bill extends Model {
  static table = tableNames.bills;

  @field('reference') reference;
  @field('is_closed') isClosed;
  @nochange @field('bill_period_id') billPeriodId;
  @date('closed_at') closedAt;

  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;

  @immutableRelation(tableNames.billPeriods, 'bill_period_id') billPeriod;

  static associations = {
    [tableNames.billPeriods]: { type: 'belongs_to', key: 'bill_period_id' },
    [tableNames.billPayments]: { type: 'has_many', foreignKey: 'bill_id' },
    [tableNames.billItems]: { type: 'has_many', foreignKey: 'bill_id' },
    [tableNames.billDiscounts]: { type: 'has_many', foreignKey: 'bill_id' },
  };

  @children(tableNames.billPayments) billPayments;
  @children(tableNames.billDiscounts) billDiscounts;
  @children(tableNames.billItems) _billItems;

  @lazy billItems = this._billItems.extend(Q.where('is_voided', Q.notEq(true)));
  @lazy billItemVoids = this._billItems.extend(Q.where('is_voided', true));
  @lazy _billModifierItems = this.collections
    .get(tableNames.billItemModifierItems)
    .query(Q.on(tableNames.billItems, 'bill_id', this.id));
  @lazy billModifierItems = this._billModifierItems.extend(Q.where('is_voided', Q.notEq(true)));
  @lazy billModifierItemVoids = this._billModifierItems.extend(Q.where('is_voided', true));

  @action addPayment = async (p: { paymentType: string; amount: number; isChange?: boolean }) => {
    const { paymentType, amount, isChange } = p;
    await this.collections.get(tableNames.billPayments).create(payment => {
      payment.paymentType.set(paymentType);
      payment.bill.set(this);
      Object.assign(payment, {
        amount,
        isChange: isChange || false,
      });
    });
  };

  @action addDiscount = async (p: { discount }) => {
    await this.collections.get(tableNames.billDiscounts).create(discount => {
      discount.bill.set(this);
      discount.discount.set(p.discount);
    });
  };

  @action addItem = async (p: { item; priceGroup }) => {
    const { item, priceGroup } = p;
    const [category, prices] = await Promise.all([item.category.fetch(), item.prices.fetch()]);

    const newItem = await this.database.action(() =>
      this.collections.get(tableNames.billItems).create(billItem => {
        billItem.bill.set(this);
        billItem.priceGroup.set(priceGroup);
        billItem.category.set(category);
        billItem.item.set(item);
        Object.assign(billItem, {
          itemName: item.name,
          itemPrice: resolvePrice(priceGroup, prices),
          priceGroupName: priceGroup.name,
          categoryName: category.name,
        });
      }),
    );

    return newItem;
  };

  @action close = async () =>
    await this.update(bill => {
      bill.isClosed = true;
      bill.closedAt = dayjs();
    });
}

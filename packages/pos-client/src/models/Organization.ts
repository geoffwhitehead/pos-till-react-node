import { Model, Relation, tableSchema } from '@nozbe/watermelondb';
import { action, field, relation } from '@nozbe/watermelondb/decorators';
import { BillPeriod, PriceGroup, Printer, tableNames } from '.';

export type OrganizationProps = {
  name: string;
  email: string;
  phone: string;
  vat: string;
  addressLine1: string;
  addressLine2: string;
  addressCity: string;
  addressCounty: string;
  addressPostcode: string;
  defaultPriceGroupId: string;
  receiptPrinterId: string;
  currency: string;
  maxBills: number;
  lastPulledAt: number;
  currentBillPeriodId: string;
  categoryGridSize: number;
  gracePeriodMinutes: number;
  maxDiscounts: number;
  shortNameLength: number;
};

export enum CategoryViewTypeEnum {
  list = 'list',
  grid = 'grid',
}

export enum CurrencyEnum {
  gbp = 'gbp',
  usd = 'usd',
  eur = 'eur',
}

export enum TransactionOrderEnum {
  descending = 'descending',
  ascending = 'ascending',
}

export enum TransactionGroupingEnum {
  grouped = 'grouped',
  ungrouped = 'ungrouped',
}

export class Organization extends Model {
  static table = 'organizations';

  @field('name') name: string;
  @field('email') email: string;
  @field('phone') phone: string;
  @field('vat') vat: string;
  @field('address_line1') addressLine1: string;
  @field('address_line2') addressLine2: string;
  @field('address_city') addressCity: string;
  @field('address_county') addressCounty: string;
  @field('address_postcode') addressPostcode: string;
  @field('default_price_group_id') defaultPriceGroupId: string;
  @field('receipt_printer_id') receiptPrinterId: string;
  @field('currency') currency: CurrencyEnum;
  @field('max_bills') maxBills: number;
  @field('last_pulled_at') lastPulledAt: string;
  @field('current_bill_period_id') currentBillPeriodId: string;
  @field('short_name_length') shortNameLength: number;
  @field('max_discounts') maxDiscounts: number;
  @field('grace_period_minutes') gracePeriodMinutes: number;
  @field('category_grid_size') categoryGridSize: number;
  @field('category_view_type') categoryViewType: CategoryViewTypeEnum;
  @field('transaction_order') transactionOrder: TransactionOrderEnum;
  @field('transaction_grouping') transactionGrouping: TransactionGroupingEnum;

  @relation('price_groups', 'default_price_group_id') defaultPriceGroup: Relation<PriceGroup>;
  @relation('printers', 'receipt_printer_id') receiptPrinter: Relation<Printer>;
  @relation('bill_periods', 'current_bill_period_id') currentBillPeriod: Relation<BillPeriod>;

  @action createNewBillPeriod = async () => {
    const newBillPeriod = this.database.collections.get<BillPeriod>(tableNames.billPeriods).prepareCreate();
    const orgUpdate = this.prepareUpdate(record => {
      record.currentBillPeriodId = newBillPeriod.id;
    });

    await this.database.batch(newBillPeriod, orgUpdate);
  };
}

export const organizationSchema = tableSchema({
  name: 'organizations',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'email', type: 'string' },
    { name: 'phone', type: 'string' },
    { name: 'vat', type: 'string' },
    { name: 'address_line1', type: 'string' },
    { name: 'address_line2', type: 'string' },
    { name: 'address_city', type: 'string' },
    { name: 'address_county', type: 'string' },
    { name: 'address_postcode', type: 'string' },
    { name: 'default_price_group_id', type: 'string' },
    { name: 'receipt_printer_id', type: 'string' },
    { name: 'currency', type: 'string' },
    { name: 'max_bills', type: 'number' },
    { name: 'last_pulled_at', type: 'string' },
    { name: 'current_bill_period_id', type: 'string' },
    { name: 'short_name_length', type: 'number' },
    { name: 'max_discounts', type: 'number' },
    { name: 'grace_period_minutes', type: 'number' },
    { name: 'category_grid_size', type: 'number' },
    { name: 'category_view_type', type: 'string' },
    { name: 'transaction_order', type: 'string' },
    { name: 'transaction_grouping', type: 'string' },
  ],
});

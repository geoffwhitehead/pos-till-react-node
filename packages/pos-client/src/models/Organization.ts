import { Model, tableSchema, Relation } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';
import { Printer, PriceGroup } from '.';

export class Organization extends Model {
  static table = 'organizations';

  @field('name') name: string;
  @field('email') email: string;
  @field('phone') phone: string;
  @field('address_line1') addressLine1: string;
  @field('address_line2') addressLine2: string;
  @field('address_city') addressCity: string;
  @field('address_county') addressCounty: string;
  @field('address_postcode') addressPostcode: string;
  @field('default_price_group_id') defaultPriceGroupId: string;
  @field('receipt_printer_id') receiptPrinterId: string;
  @field('currency') currency: string;
  @field('max_bills') maxBills: number;


  @relation('price_groups', "default_price_group_id") defaultPriceGroup: Relation<PriceGroup>
  @relation('printers', "receipt_printer_id") receiptPrinter: Relation<Printer>
}

export const organizationSchema = tableSchema({
  name: 'organizations',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'email', type: 'string' },
    { name: 'phone', type: 'string' },
    { name: 'address_line1', type: 'string' },
    { name: 'address_line2', type: 'string' },
    { name: 'address_city', type: 'string' },
    { name: 'address_county', type: 'string' },
    { name: 'address_postcode', type: 'string' },
    { name: 'default_price_group_id', type: 'string' },
    { name: 'receipt_printer_id', type: 'string' },
    { name: 'currency', type: 'string' },
    { name: 'max_bills', type: 'number' },
  ],
});

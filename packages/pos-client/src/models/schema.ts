import { appSchema, tableSchema } from '@nozbe/watermelondb';
import { PriceGroupProps } from '../services/schemas';

export default appSchema({
  version: 3,
  tables: [
    tableSchema({
      name: 'printers',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'type', type: 'string' },
        { name: 'address', type: 'string' },
      ],
    }),

    tableSchema({
      name: 'price_groups',
      columns: [{ name: 'name', type: 'string' }],
    }),
    tableSchema({
      name: 'categories',
      columns: [{ name: 'name', type: 'string' }],
    }),
    tableSchema({
      name: 'modifier_prices',
      columns: [
        { name: 'price', type: 'number' },
        { name: 'price_group_id', type: 'string' },
        { name: 'modifier_item_id', type: 'string', isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'modifiers',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'minItems', type: 'string' },
        { name: 'maxItems', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'modifier_items',
      columns: [
        { name: 'modifier_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        // { name: 'modifier_prices_id', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'discounts',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'amount', type: 'number' },
        { name: 'is_percent', type: 'boolean' },
      ],
    }),

    tableSchema({
      name: 'payment_types',
      columns: [{ name: 'name', type: 'string' }],
    }),

    tableSchema({
      name: 'items',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'category_id', type: 'string', isIndexed: true },
        // { name: 'modifier_id', type: 'string', isOptional: true },
        // { name: 'item_printers_id', type: 'string' }, // pivot table many to many
      ],
    }),

    tableSchema({
      name: 'item_modifiers',
      columns: [
        { name: 'item_id', type: 'string' },
        { name: 'modifier_id', type: 'string' },
      ],
    }),

    // modifier_item_revision_id
    // modifier_revision_id
    // item_revision_id
    // discount_revision_id

    tableSchema({
      name: 'item_prices',
      columns: [
        { name: 'price', type: 'number' },
        { name: 'price_group_id', type: 'string' },
        { name: 'item_id', type: 'string', isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'item_printers',
      columns: [
        { name: 'item_id', type: 'string', isIndexed: true },
        { name: 'printer_id', type: 'string' },
      ],
    }),

    tableSchema({
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
      ],
    }),

    // LOCAL SCHEMAS

    tableSchema({
      name: 'bill_payments',
      columns: [
        { name: 'payment_type_id', type: 'string' },
        { name: 'bill_id', type: 'string', isIndexed: true },
        { name: 'amount', type: 'number' },
        { name: 'is_change', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'bills',
      columns: [
        { name: 'reference', type: 'number' },
        { name: 'is_closed', type: 'boolean' },
        { name: 'bill_period_id', type: 'string', isIndexed: true },
        { name: 'closed_at', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'bill_discounts',
      columns: [
        { name: 'bill_id', type: 'string', isIndexed: true },
        { name: 'discount_id', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'bill_periods',
      columns: [
        { name: 'created_at', type: 'number' },
        { name: 'closed_at', type: 'number', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'bill_items',
      columns: [
        { name: 'bill_id', type: 'string', isIndexed: true },
        { name: 'item_id', type: 'string' },
        { name: 'item_name', type: 'string' },
        { name: 'item_price', type: 'number' },
        { name: 'price_group_name', type: 'string' },
        { name: 'price_group_id', type: 'string' },
        // { name: 'modifier_name', type: 'string' },
        // { name: 'modifier_id', type: 'string' },
        { name: 'category_name', type: 'string' },
        { name: 'category_id', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'bill_item_modifiers',
      columns: [
        { name: 'bill_item_id', type: 'string', isIndexed: true },
        { name: 'modifier_name', type: 'string' },
        { name: 'modifier_id', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'bill_item_modifier_items',
      columns: [
        { name: 'bill_item_id', type: 'string', isIndexed: true },
        { name: 'modifier_item_id', type: 'string' },
        { name: 'modifier_item_name', type: 'string' },
        { name: 'modifier_item_price', type: 'number' },
      ],
    }),
  ],
});

export interface BillItemProps {
  _id: string;
  itemId: string;
  name: string;
  price: number;
  modifierId?: string;
  mods: Realm.Collection<BillItemModifierProps>;
  categoryId: string;
  categoryName: string;
  priceGroup: PriceGroupProps;
}

export const BillItemSchema: Realm.ObjectSchema = {
  name: 'BillItem',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    itemId: 'string',
    name: 'string',
    price: 'float', // TODO: it might be better for all prices to be a PriceGroupItem. This is a large refactor though.
    // modifierId: 'string?',
    mods: { type: 'BillItemModifier[]', default: [] },
    categoryId: 'string',
    categoryName: 'string',
    priceGroup: 'PriceGroup', // TODO: it might be better for all prices to be a PriceGroupItem. This is a large refactor though
  },
};

export interface BillPeriodProps {
  _id: string;
  opened: Date;
  closed?: Date;
}

export const BillPeriodSchema: Realm.ObjectSchema = {
  name: 'BillPeriod',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    opened: 'date',
    closed: 'date?',
  },
};

export interface BillDiscountProps {
  _id: string;
  discountId: string;
  name: string;
  amount: number;
  isPercent: boolean;
}
export const BillDiscountSchema: Realm.ObjectSchema = {
  name: 'BillDiscount',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    discountId: 'string',
    name: 'string',
    amount: 'float',
    isPercent: 'bool',
  },
};

export interface BillProps {
  _id: string;
  items: Realm.Collection<BillItemProps>; // move to new table - var in model
  payments: Realm.Collection<BillPaymentProps>; // new table  - var in model
  timestamp: Date;
  discounts: Realm.Collection<BillDiscountProps>; // new table  - var in model
  tab: number;
  isClosed: boolean;
  closedAt?: Date;
  billPeriod: BillPeriodProps;
}

export const BillSchema: Realm.ObjectSchema = {
  name: 'Bill',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    items: { type: 'BillItem[]', default: [] },
    payments: { type: 'BillPayment[]', default: [] },
    timestamp: { type: 'date', default: Date() },
    discounts: { type: 'BillDiscount[]', default: [] },
    tab: 'int',
    isClosed: { type: 'bool', default: false, indexed: true },
    closedAt: 'date?',
    billPeriod: { type: 'BillPeriod' },
  },
};

export interface BillPaymentProps {
  _id: string;
  paymentType: string;
  paymentTypeId: string;
  amount: number;
  timestamp: Date;
  isChange: Boolean;
}

export const BillPaymentSchema: Realm.ObjectSchema = {
  name: 'BillPayment',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    paymentType: 'string',
    paymentTypeId: 'string',
    amount: 'float',
    timestamp: { type: 'date', default: Date() },
    isChange: { type: 'bool', default: false },
  },
};

export interface BillItemModifierProps {
  _id: string;
  modId: string;
  name: string;
  price: number;
}

export const BillItemModifierSchema: Realm.ObjectSchema = {
  name: 'BillItemModifier',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    modId: 'string',
    name: 'string',
    price: 'float',
  },
};

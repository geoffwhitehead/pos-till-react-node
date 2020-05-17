import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 2,
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
        { name: 'modifier_item_revision_id', type: 'string', isIndexed: true }, //*
        { name: 'revision', type: 'number'},
        { name: 'modifier_price_revision_id', type: 'string'} 
      ],
    }),
    tableSchema({ //*
      name: 'modifier_price_revisions',
      columns: [
        { name: 'price', type: 'number' },
        { name: 'price_group_id', type: 'string' },
        { name: 'modifier_item_revision_id', type: 'string', isIndexed: true },
        { name: 'revision', type: 'number'} 
      ],
    }),
    tableSchema({
      name: 'modifiers',
      columns: [{ name: 'name', type: 'string' }, { name: 'revision', type: 'string'}],
    }),
    tableSchema({
      name: 'modifier_revisions',
      columns: [{ name: 'name', type: 'string' },{ name: 'revision', type: 'string'} ],
      
    }),
    tableSchema({
      name: 'modifier_items',
      columns: [
        { name: 'modifier_revision_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'revision', type: 'string'}
        // { name: 'modifier_prices_id', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'modifier_item_revisions',
      columns: [
        { name: 'modifier_revision_id', type: 'string', isIndexed: true }, //*
        { name: 'name', type: 'string' },
        { name: 'revision', type: 'string'}
        // { name: 'modifier_prices_id', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'discounts',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'amount', type: 'string' },
        { name: 'is_percent', type: 'boolean' },
        { name: 'revision', type: 'string'}
      ],
    }),
    tableSchema({
      name: 'discount_revisions',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'amount', type: 'string' },
        { name: 'is_percent', type: 'boolean' },
        { name: 'revision', type: 'string'}
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
        { name: 'modifier_revision_id', type: 'string', isOptional: true },
        { name: 'revision', type: 'string'}
      ],
    }),

    tableSchema({
      name: 'item_revisions',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'category_id', type: 'string', isIndexed: true },
        { name: 'modifier_revision_id', type: 'string', isOptional: true },
        { name: 'revision', type: 'string'}
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
        { name: 'item_revision_id', type: 'string', isIndexed: true },
        { name: 'revision', type: 'string'}

      ],
    }),
    tableSchema({
      name: 'item_price_revisions',
      columns: [
        { name: 'price', type: 'number' },
        { name: 'price_group_id', type: 'string' },
        { name: 'item_revision_id', type: 'string', isIndexed: true },
        { name: 'revision', type: 'string'}

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
    // tableSchema({
    //     name: 'bill_payments',
    //     columns: [
    //         { name: '_id', type: 'string' },
    //         { name: 'payment_types_id', type: 'string' },
    //         { name: 'payment_types_name', type: 'string' },
    //         { name: 'amount', type: 'string' },
    //         { name: 'created_on', type: 'string' },
    //         { name: 'is_credit', type: 'boolean' }, // previously isChange
    //     ]
    // })
  ],
});


const localSchemas = [
    tableSchema({
      name: 'bill_payments',
      columns: [
        { name: 'payment_type_id', type: 'string' },
        { name: 'bill_id', type: 'string', isIndexed: true},
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
        { name: 'closed_at', type: 'number', isOptional: true  },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'bill_discounts',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'bill_id', type: 'string', isIndexed: true },
        { name: 'discount_revision_id', type: 'string'}
        // { name: 'amount', type: 'number'  },
        // { name: 'is_percent', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name:'bill_periods',
      columns: [
        { name: 'created_at', type: 'number' },
        { name: 'closed_at', type: 'number', isOptional: true },
      ]
    }),
    tableSchema({
      name:'bill_items',
      columns: [
        { name: 'bill_id', type: 'string', isIndexed: true },
        { name: 'item_revision_id', type: 'string' },
        { name: 'price_group_id', type: 'string' },
        { name: 'modifier_revision_id', type: 'string' },
        { name: 'category_id', type: 'string' },
      ]
    }),
    tableSchema({
      name:'bill_item_modifier_items',
      columns: [
        { name: 'bill_item_id', type: 'string', isIndexed: true },
        { name: 'modifier_item_revision_id', type: 'string' },
      ]
    }),

]


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

// export interface BillPeriodProps {
//   _id: string;
//   opened: Date;
//   closed?: Date;
// }

// export const BillPeriodSchema: Realm.ObjectSchema = {
//   name: 'BillPeriod',
//   primaryKey: '_id',
//   properties: {
//     _id: 'string',
//     opened: 'date',
//     closed: 'date?',
//   },
// };


// export interface BillDiscountProps {
//   _id: string;
//   discountId: string;
//   name: string;
//   amount: number;
//   isPercent: boolean;
// }
// export const BillDiscountSchema: Realm.ObjectSchema = {
//   name: 'BillDiscount',
//   primaryKey: '_id',
//   properties: {
//     _id: 'string',
//     discountId: 'string',
//     name: 'string',
//     amount: 'float',
//     isPercent: 'bool',
//   },
// };

// export interface BillProps {
//   _id: string;
//   items: Realm.Collection<BillItemProps>; // move to new table - var in model
//   payments: Realm.Collection<BillPaymentProps>; // new table  - var in model
//   timestamp: Date;
//   discounts: Realm.Collection<BillDiscountProps>; // new table  - var in model
//   tab: number;
//   isClosed: boolean;
//   closedAt?: Date;
//   billPeriod: BillPeriodProps;
// }

// export const BillSchema: Realm.ObjectSchema = {
//   name: 'Bill',
//   primaryKey: '_id',
//   properties: {
//     _id: 'string',
//     items: { type: 'BillItem[]', default: [] },
//     payments: { type: 'BillPayment[]', default: [] },
//     timestamp: { type: 'date', default: Date() },
//     discounts: { type: 'BillDiscount[]', default: [] },
//     tab: 'int',
//     isClosed: { type: 'bool', default: false, indexed: true },
//     closedAt: 'date?',
//     billPeriod: { type: 'BillPeriod' },
//   },
// };


// export interface BillPaymentProps {
//   _id: string;
//   paymentType: string;
//   paymentTypeId: string;
//   amount: number;
//   timestamp: Date;
//   isChange: Boolean;
// }

// export const BillPaymentSchema: Realm.ObjectSchema = {
//   name: 'BillPayment',
//   primaryKey: '_id',
//   properties: {
//     _id: 'string',
//     paymentType: 'string',
//     paymentTypeId: 'string',
//     amount: 'float',
//     timestamp: { type: 'date', default: Date() },
//     isChange: { type: 'bool', default: false },
//   },
// };

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

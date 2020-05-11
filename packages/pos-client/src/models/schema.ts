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
      name: 'item_prices',
      columns: [
        { name: 'price', type: 'number' },
        { name: 'price_group_id', type: 'string' },
        { name: 'item_id', type: 'string', isIndexed: true },
      ],
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
      columns: [{ name: 'name', type: 'string' }],
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
      name: 'payment_types',
      columns: [{ name: 'name', type: 'string' }],
    }),
    
    tableSchema({
      name: 'discounts',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'amount', type: 'string' },
        { name: 'isPercent', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'item_printers',
      columns: [
        { name: '_id', type: 'string' },
        { name: 'item_id', type: 'string' },
        { name: 'printer_id', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'items',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'category_id', type: 'string', isIndexed: true },
        { name: 'modifier_id', type: 'string', isOptional: true },
        { name: 'item_printers_id', type: 'string' }, // pivot table many to many
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

import { Model, TableSchema } from '@nozbe/watermelondb';
import { Bill, billSchema } from './Bill';
import { BillDiscount, billDiscountSchema } from './BillDiscount';
import { BillItem, billItemSchema } from './BillItem';
import { BillItemModifier, billItemModifierSchema } from './BillItemModifier';
import { BillItemModifierItem, billItemModifierItemSchema } from './BillItemModifierItem';
import { BillItemPrintLog, billItemPrintLogSchema } from './BillItemPrintLog';
import { BillPayment, billPaymentSchema } from './BillPayment';
import { BillPeriod, billPeriodSchema } from './BillPeriod';
import { Category, categorySchema } from './Category';
import { Discount, discountSchema } from './Discount';
import { Item, itemSchema } from './Item';
import { ItemModifier, itemModifierSchema } from './ItemModifier';
import { ItemPrice, itemPriceSchema } from './ItemPrice';
// import { itemPrinterSchema, ItemPrinter } from './ItemPrinter';
import { Modifier, modifierSchema } from './Modifier';
import { ModifierItem, modifierItemSchema } from './ModifierItem';
import { ModifierPrice, modifierPriceSchema } from './ModifierPrice';
import { Organization, organizationSchema } from './Organization';
import { PaymentType, paymentTypeSchema } from './PaymentType';
import { PriceGroup, priceGroupSchema } from './PriceGroup';
import { Printer, printerSchema } from './Printer';
import { PrinterGroup, printerGroupSchema } from './PrinterGroup';
import { PrinterGroupPrinter, printerGroupPrinterSchema } from './PrinterGroupPrinter';

// export const tableNames = {
//   modifiers: 'modifiers',
//   itemModifiers: 'item_modifiers',
//   priceGroups: 'price_groups',
//   itemPrices: 'item_prices',
//   modifierPrices: 'modifier_prices',
//   paymentTypes: 'payment_types',
//   modifierItems: 'modifier_items',
//   discounts: 'discounts',
//   organizations: 'organizations',
//   printers: 'printers',
//   categories: 'categories',
//   itemPrinters: 'item_printers',
//   items: 'items',
//   billPayments: 'bill_payments',
//   bills: 'bills',
//   billDiscounts: 'bill_discounts',
//   billPeriods: 'bill_periods',
//   billItems: 'bill_items',
//   billItemModifiers: 'bill_item_modifiers',
//   billItemModifierItems: 'bill_item_modifier_items',
// };

type TableNames = {
  paymentTypes: string;
  discounts: string;
  organizations: string;
  categories: string;
  items: string;
  itemPrices: string;
  itemModifiers: string;
  modifiers: string;
  modifierItems: string;
  modifierPrices: string;
  priceGroups: string;
  printers: string;
  printerGroups: string;
  printerGroupsPrinters: string;
  // itemPrinters: itemPrinterSchema.name,
  billPayments: string;
  bills: string;
  billDiscounts: string;
  billPeriods: string;
  billItems: string;
  billItemModifiers: string;
  billItemModifierItems: string;
  billItemPrintLogs: string;
};

export const tableNames: TableNames = {
  paymentTypes: paymentTypeSchema.name,
  discounts: discountSchema.name,
  organizations: organizationSchema.name,
  categories: categorySchema.name,
  items: itemSchema.name,
  itemPrices: itemPriceSchema.name,
  itemModifiers: itemModifierSchema.name,
  modifiers: modifierSchema.name,
  modifierItems: modifierItemSchema.name,
  modifierPrices: modifierPriceSchema.name,
  priceGroups: priceGroupSchema.name,
  printers: printerSchema.name,
  printerGroups: printerGroupSchema.name,
  printerGroupsPrinters: printerGroupPrinterSchema.name,
  // itemPrinters: itemPrinterSchema.name,
  billPayments: billPaymentSchema.name,
  bills: billSchema.name,
  billDiscounts: billDiscountSchema.name,
  billPeriods: billPeriodSchema.name,
  billItems: billItemSchema.name,
  billItemModifiers: billItemModifierSchema.name,
  billItemModifierItems: billItemModifierItemSchema.name,
  billItemPrintLogs: billItemPrintLogSchema.name,
};

export const schemas: Record<string, TableSchema> = {
  billSchema,
  billDiscountSchema,
  billItemSchema,
  billItemModifierSchema,
  billItemModifierItemSchema,
  billPaymentSchema,
  billPeriodSchema,
  categorySchema,
  discountSchema,
  itemSchema,
  itemModifierSchema,
  itemPriceSchema,
  // itemPrinterSchema,
  modifierSchema,
  modifierItemSchema,
  modifierPriceSchema,
  organizationSchema,
  paymentTypeSchema,
  priceGroupSchema,
  printerSchema,
  billItemPrintLogSchema,
  printerGroupSchema,
  printerGroupPrinterSchema,
};

export const models: Record<string, typeof Model> = {
  Item,
  ItemModifier,
  ModifierItem,
  // ItemPrinter,
  Category,
  Printer,
  Modifier,
  PriceGroup,
  ItemPrice,
  ModifierPrice,
  PaymentType,
  Discount,
  Organization,
  Bill,
  BillDiscount,
  BillItem,
  BillPayment,
  BillPeriod,
  BillItemModifierItem,
  BillItemModifier,
  BillItemPrintLog,
  PrinterGroup,
  PrinterGroupPrinter,
};

export {
  Item,
  ItemModifier,
  ModifierItem,
  // ItemPrinter,
  Category,
  Printer,
  Modifier,
  PriceGroup,
  ItemPrice,
  ModifierPrice,
  PaymentType,
  Discount,
  Organization,
  Bill,
  BillDiscount,
  BillItem,
  BillPayment,
  BillPeriod,
  BillItemModifierItem,
  BillItemModifier,
  BillItemPrintLog,
  PrinterGroup,
  PrinterGroupPrinter,
};

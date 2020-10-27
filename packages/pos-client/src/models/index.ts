import { billSchema, Bill } from './Bill';
import { billDiscountSchema, BillDiscount } from './BillDiscount';
import { billItemSchema, BillItem } from './BillItem';
import { billItemModifierSchema, BillItemModifier } from './BillItemModifier';
import { billItemModifierItemSchema, BillItemModifierItem } from './BillItemModifierItem';
import { billPaymentSchema, BillPayment } from './BillPayment';
import { billPeriodSchema, BillPeriod } from './BillPeriod';
import { categorySchema, Category } from './Category';
import { discountSchema, Discount } from './Discount';
import { itemSchema, Item } from './Item';
import { itemModifierSchema, ItemModifier } from './ItemModifier';
import { itemPriceSchema, ItemPrice } from './ItemPrice';
// import { itemPrinterSchema, ItemPrinter } from './ItemPrinter';
import { modifierSchema, Modifier } from './Modifier';
import { modifierItemSchema, ModifierItem } from './ModifierItem';
import { modifierPriceSchema, ModifierPrice } from './ModifierPrice';
import { organizationSchema, Organization } from './Organization';
import { paymentTypeSchema, PaymentType } from './PaymentType';
import { printerSchema, Printer } from './Printer';
import { priceGroupSchema, PriceGroup } from './PriceGroup';
import { Model, TableSchema } from '@nozbe/watermelondb';
import { BillItemPrintLog, billItemPrintLogSchema } from './BillItemPrintLog';
import { printerGroupSchema, PrinterGroup } from './PrinterGroup';
import { printerGroupPrinterSchema, PrinterGroupPrinter } from './PrinterGroupPrinter';

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

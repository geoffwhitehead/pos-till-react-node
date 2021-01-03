import { Model, TableSchema } from '@nozbe/watermelondb';
import { Bill, billSchema } from './Bill';
import { BillCallLog, billCallLogSchema } from './BillCallLog';
import { BillCallPrintLog, billCallPrintLogSchema } from './BillCallPrintLog';
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
import { ModifierItemPrice, modifierItemPriceSchema } from './ModifierItemPrice';
import { Organization, organizationSchema } from './Organization';
import { PaymentType, paymentTypeSchema } from './PaymentType';
import { PriceGroup, priceGroupSchema } from './PriceGroup';
import { PrintCategory, printCategorySchema } from './PrintCategory';
import { Printer, printerSchema } from './Printer';
import { PrinterGroup, printerGroupSchema } from './PrinterGroup';
import { PrinterGroupPrinter, printerGroupPrinterSchema } from './PrinterGroupPrinter';
import { TablePlanElement, tablePlanElementSchema } from './TablePlanElement';

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
  modifierItemPrices: string;
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
  billCallLogs: string;
  billCallPrintLogs: string;
  tablePlanElements: string;
  printCategories: string;
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
  modifierItemPrices: modifierItemPriceSchema.name,
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
  billCallLogs: billCallLogSchema.name,
  billCallPrintLogs: billCallPrintLogSchema.name,
  tablePlanElements: tablePlanElementSchema.name,
  printCategories: printCategorySchema.name,
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
  modifierItemPriceSchema,
  organizationSchema,
  paymentTypeSchema,
  priceGroupSchema,
  printerSchema,
  billItemPrintLogSchema,
  printerGroupSchema,
  printerGroupPrinterSchema,
  billCallLogSchema,
  billCallPrintLogSchema,
  tablePlanElementSchema,
  printCategorySchema,
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
  ModifierItemPrice,
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
  BillCallLog,
  BillCallPrintLog,
  TablePlanElement,
  PrintCategory,
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
  ModifierItemPrice,
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
  BillCallLog,
  BillCallPrintLog,
  TablePlanElement,
  PrintCategory,
};

import { billSchema, BillModel } from './Bill';
import { billDiscountSchema, BillDiscountModel } from './BillDiscount';
import { billItemSchema, BillItemModel } from './BillItem';
import { billItemModifierSchema, BillItemModifierModel } from './BillItemModifier';
import { billItemModifierItemSchema, BillItemModifierItemModel } from './BillItemModifierItem';
import { billPaymentSchema, BillPaymentModel } from './BillPayment';
import { billPeriodSchema, BillPeriodModel } from './BillPeriod';
import { categorySchema, CategoryModel } from './Category';
import { discountSchema, DiscountModel } from './Discount';
import { itemSchema, ItemModel } from './Item';
import { itemModifierSchema, ItemModifierModel } from './ItemModifier';
import { itemPriceSchema, ItemPriceModel } from './ItemPrice';
import { itemPrinterSchema, ItemPrinterModel } from './ItemPrinter';
import { modifierSchema, ModifierModel } from './Modifier';
import { modifierItemSchema, ModifierItemModel } from './ModifierItem';
import { modifierPriceSchema, ModifierPriceModel } from './ModifierPrice';
import { organizationSchema, OrganizationModel } from './Organization';
import { paymentTypeSchema, PaymentTypeModel } from './PaymentType';
import { printerSchema, PrinterModel } from './Printer';
import { priceGroupSchema, PriceGroupModel } from './PriceGroup';

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

export const tableNames = {
  modifiers: modifierSchema.name,
  itemModifiers: itemModifierSchema.name,
  priceGroups: priceGroupSchema.name,
  itemPrices: itemPriceSchema.name,
  modifierPrices: modifierPriceSchema.name,
  paymentTypes: paymentTypeSchema.name,
  modifierItems: modifierItemSchema.name,
  discounts: discountSchema.name,
  organizations: organizationSchema.name,
  printers: printerSchema.name,
  categories: categorySchema.name,
  itemPrinters: itemPrinterSchema.name,
  items: itemSchema.name,
  billPayments: billPaymentSchema.name,
  bills: billSchema.name,
  billDiscounts: billDiscountSchema.name,
  billPeriods: billPeriodSchema.name,
  billItems: billItemSchema.name,
  billItemModifiers: billItemModifierSchema.name,
  billItemModifierItems: billItemModifierItemSchema.name,
};

export const schemas = {
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
  itemPrinterSchema,
  modifierSchema,
  modifierItemSchema,
  modifierPriceSchema,
  organizationSchema,
  paymentTypeSchema,
  priceGroupSchema,
  printerSchema,
};

export const models = {
  ItemModel,
  ItemModifierModel,
  ModifierItemModel,
  ItemPrinterModel,
  CategoryModel,
  PrinterModel,
  ModifierModel,
  PriceGroupModel,
  ItemPriceModel,
  ModifierPriceModel,
  PaymentTypeModel,
  DiscountModel,
  OrganizationModel,
  BillModel,
  BillDiscountModel,
  BillItemModel,
  BillPaymentModel,
  BillPeriodModel,
  BillItemModifierItemModel,
  BillItemModifierModel,
};

// PROP EXPRTS
// export {
//   Item,
//   ItemModifier,
//   ModifierItem,
//   ItemPrinter,
//   Category,
//   Printer,
//   Modifier,
//   PriceGroup,
//   ItemPrice,
//   ModifierPrice,
//   PaymentType,
//   Discount,
//   Organization,
//   Bill,
//   BillDiscount,
//   BillItem,
//   BillPayment,
//   BillPeriod,
//   BillItemModifierItem,
//   BillItemModifier,
// };

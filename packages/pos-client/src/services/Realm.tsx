import Realm from 'realm';
import {
  ItemSchema,
  BillItemModifierSchema,
  BillItemSchema,
  BillPaymentSchema,
  BillSchema,
  BillDiscountSchema,
  PaymentTypeSchema,
  ModifierItemSchema,
  ModifierSchema,
  OrganizationSchema,
  CategorySchema,
  DiscountSchema,
  BillPeriodSchema,
  PriceGroupSchema,
  PriceGroupItemSchema,
  PrinterSchema,
} from './schemas';

const realm = new Realm({
  schema: [
    PriceGroupSchema,
    PriceGroupItemSchema,
    ItemSchema,
    BillPaymentSchema,
    ModifierItemSchema,
    ModifierSchema,
    OrganizationSchema,
    BillItemModifierSchema,
    BillItemSchema,
    BillSchema,
    CategorySchema,
    BillDiscountSchema,
    PaymentTypeSchema,
    DiscountSchema,
    BillPeriodSchema,
    PrinterSchema,
  ],
  schemaVersion: 18,
  migration: function(oldRealm, newRealm) {
    newRealm.deleteAll();
  },
});

export { realm };

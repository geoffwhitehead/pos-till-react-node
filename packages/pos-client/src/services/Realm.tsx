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
} from './schemas';

const realm = new Realm({
  schema: [
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
  ],
  schemaVersion: 14,
  migration: function(oldRealm, newRealm) {
    newRealm.deleteAll();
  },
});

export { realm };

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
  ],
  schemaVersion: 10,
  // migration: function(oldRealm, newRealm) {
  //   newRealm.deleteAll();
  // },
});

export { realm };

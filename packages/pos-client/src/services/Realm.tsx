import Realm from 'realm';
import {
  ItemSchema,
  BillItemModifierSchema,
  BillItemSchema,
  BillPaymentSchema,
  BillSchema,
  ModifierItem,
  ModifierSchema,
  OrganizationSchema,
  CategorySchema,
} from './schemas';

const realm = new Realm({
  schema: [
    ItemSchema,
    BillPaymentSchema,
    ModifierItem,
    ModifierSchema,
    OrganizationSchema,
    BillItemModifierSchema,
    BillItemSchema,
    BillSchema,
    CategorySchema,
  ],
  schemaVersion: 8,
  migration: function(oldRealm, newRealm) {
    newRealm.deleteAll();
  },
});

export { realm };

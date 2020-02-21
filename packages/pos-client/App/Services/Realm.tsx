import Realm from 'realm'
import {
  ItemSchema,
  BillItemModifierSchema,
  BillItemSchema,
  PaymentSchema,
  BillSchema,
  ModifierItem,
  ModifierSchema,
  OrganizationSchema,
  CategorySchema,
  // BillRegister,
} from './schemas'

const realm = new Realm({
  schema: [
    ItemSchema,
    PaymentSchema,
    ModifierItem,
    ModifierSchema,
    OrganizationSchema,
    BillItemModifierSchema,
    BillItemSchema,
    BillSchema,
    CategorySchema,
    // BillRegister,
  ],
  schemaVersion: 5,
  migration: function(oldRealm, newRealm) {
    newRealm.deleteAll()
  },
})

export { realm }

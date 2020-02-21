import Realm from 'realm'
import {
  ItemSchema,
  SelectedModsSchema,
  BillItemSchema,
  PaymentSchema,
  BillSchema,
  ModifierItem,
  ModifierSchema,
  OrganizationSchema,
  CategorySchema,
  BillRegister,
} from './schemas'

const realm = new Realm({
  schema: [
    ItemSchema,
    PaymentSchema,
    ModifierItem,
    ModifierSchema,
    OrganizationSchema,
    SelectedModsSchema,
    BillItemSchema,
    BillSchema,
    CategorySchema,
    BillRegister,
  ],
  schemaVersion: 2,
  migration: function(oldRealm, newRealm) {
    newRealm.deleteAll()
  },
})

export { realm }

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
  ],
})

export { realm }

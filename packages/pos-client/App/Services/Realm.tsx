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
} from './schemas'

const realm = new Realm({
  schema: [
    ItemSchema,
    SelectedModsSchema,
    BillItemSchema,
    PaymentSchema,
    BillSchema,
    ModifierItem,
    ModifierSchema,
    OrganizationSchema,
  ],
})

export { realm }

export interface ItemProps {
  _id: string,
  name: string,
  categoryId: Realm.Results<CategoryProps>,
  price: number,
  modifierId?: Realm.Results<ModifierProps>,
}

export const ItemSchema: Realm.ObjectSchema = {
  name: 'Item',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    name: 'string',
    categoryId: 'Category',
    price: 'float',
    modifierId: { type: 'Modifier', optional: true },
  },
}

export interface ModifierItemProps {
  _id: string,
  name: string,
  price: number,
}

export const ModifierItem: Realm.ObjectSchema = {
  name: 'ModifierItem',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    name: 'string',
    price: 'float',
  },
}

export interface ModifierProps {
  _id: string,
    name: string,
    mods: Realm.Results<ModifierItemProps>,
}

export const ModifierSchema: Realm.ObjectSchema = {
  name: 'Modifier',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    name: 'string',
    mods: 'ModifierItem[]',
  },
}

export interface CategoryProps {
  _id: string,
  name: string,
}

export const CategorySchema: Realm.ObjectSchema = {
  name: 'Category',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    name: 'string',
  },
}

export const OrganizationSchema: Realm.ObjectSchema = {
  name: 'Organization',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    firstName: 'string',
    lastName: 'string',
    email: 'string',
    token: 'string',
    dataId: 'string',
  },
}

export interface BillPaymentProps {
  _id: string,
    type: string,
    amount: number,
    timestamp: Date,
}


export const BillPaymentSchema: Realm.ObjectSchema = {
  name: 'BillPayment',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    type: 'string',
    amount: 'float',
    timestamp: 'date',
  },
}

export interface BillItemModifierProps {
  _id: string,
  modId: string,
  name: string,
  price: number,
}

export const BillItemModifierSchema: Realm.ObjectSchema = {
  name: 'BillItemModifier',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    modId: 'string',
    name: 'string',
    price: 'float',
  },
}

export interface BillItemProps {
    _id: string,
    itemId: string,
    name: string,
    price: number,
    modifierId?: string,
    mods: Realm.Results<BillItemModifierProps>,
    categoryId: string,
    categoryName: string,
}

export const BillItemSchema: Realm.ObjectSchema = {
  name: 'BillItem',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    itemId: 'string',
    name: 'string',
    price: 'float',
    modifierId: 'string?',
    mods: {type: 'BillItemModifier[]', default: []},
    categoryId: 'string',
    categoryName: 'string',
  },
}


export interface BillProps {
  _id: string,
  items: Realm.Results<BillItemProps>
  payments: Realm.Results<BillPaymentProps>
  timestamp: Date,
  discount?: number,
  tab: number,
  isClosed: boolean
}

export const BillSchema: Realm.ObjectSchema = {
  name: 'Bill',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    items: { type: 'BillItem[]', default: [] },
    payments: { type: 'BillPayment[]', default: [] },
    timestamp: { type: 'date', default: Date() },
    discount: { type: 'int', optional: true },
    tab: 'int',
    isClosed: { type: 'bool', default: false, indexed: true },
  },
}

// export const BillRegister = {
//   name: 'BillRegister',
//   properties: {
//     maxBills: { type: 'int', default: 40 },
//     activeBill: { type: 'int', optional: true },
//     openBills: { type: 'Bill[]', default: [] },
//   },
// }

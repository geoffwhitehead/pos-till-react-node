export const ItemSchema = {
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

export const PaymentSchema = {
  name: 'Payment',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    type: 'string',
    amount: 'float',
    timestamp: 'date',
  },
}

export const ModifierItem = {
  name: 'ModifierItem',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    name: 'string',
    price: 'float',
  },
}

export const ModifierSchema = {
  name: 'Modifier',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    name: 'string',
    mods: 'ModifierItem[]',
  },
}

export const OrganizationSchema = {
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
export const BillItemModifierSchema = {
  name: 'BillItemModifier',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    modId: 'string',
    name: 'string',
    price: 'float',
  },
}

export const BillItemSchema = {
  name: 'BillItem',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    itemId: 'string',
    name: 'string',
    price: 'float',
    modifierId: 'string',
    mods: 'BillItemModifier[]',
    categoryId: 'string',
    categoryName: 'string',
  },
}

export const CategorySchema = {
  name: 'Category',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    name: 'string',
  },
}

export const BillSchema = {
  name: 'Bill',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    items: { type: 'BillItem[]', default: [] },
    payments: { type: 'Payment[]', default: [] },
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

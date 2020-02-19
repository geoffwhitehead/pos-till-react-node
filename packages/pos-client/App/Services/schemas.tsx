export const ItemSchema = {
  name: 'Item',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    name: 'string',
    categoryId: 'Category',
    price: 'float',
    modifierId: 'Modifier',
  },
}

export const SelectedModsSchema = {
  name: 'SelectedMod',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    modId: 'ModifierItem',
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
    modId: 'Modifier',
    mods: 'SelectedMods[]',
    categoryId: 'Category',
    categoryName: 'string',
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

export const BillSchema = {
  name: 'Bill',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    items: 'BillItem[]',
    payments: 'Payment[]',
    timestamp: 'date',
    discount: 'int',
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

export const ModifierItem = {
  name: 'ModifierItem',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    name: 'string',
    price: 'float',
  },
}

export const OrganizationSchema = {
  name: 'Organization',
  primaryKey: '_id',
  properties: {
    firstName: 'string',
    lastName: 'string',
    email: 'string',
    token: 'string',
    dataId: 'string',
  },
}

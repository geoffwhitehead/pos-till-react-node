export interface ItemProps {
  _id: string;
  name: string;
  categoryId: Realm.Collection<CategoryProps>;
  price: number;
  modifierId?: Realm.Collection<ModifierProps>;
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
};

export interface PaymentTypeProps {
  _id: string;
  name: string;
}

export const PaymentTypeSchema: Realm.ObjectSchema = {
  name: 'PaymentType',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    name: 'string',
  },
};

export interface ModifierItemProps {
  _id: string;
  name: string;
  price: number;
}

export const ModifierItemSchema: Realm.ObjectSchema = {
  name: 'ModifierItem',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    name: 'string',
    price: 'float',
  },
};

export interface ModifierProps {
  _id: string;
  name: string;
  mods: Realm.Collection<ModifierItemProps>;
}

export const ModifierSchema: Realm.ObjectSchema = {
  name: 'Modifier',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    name: 'string',
    mods: 'ModifierItem[]',
  },
};

export interface CategoryProps {
  _id: string;
  name: string;
}

export const CategorySchema: Realm.ObjectSchema = {
  name: 'Category',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    name: 'string',
  },
};

export interface DiscountProps {
  _id: string;
  name: string;
  amount: number;
  isPercent: boolean;
}
export const DiscountSchema: Realm.ObjectSchema = {
  name: 'Discount',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    name: 'string',
    amount: 'float',
    isPercent: 'bool',
  },
};

export interface OrganizationProps {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  dataId: string;
  allowMultipleDiscounts?: boolean;
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
    allowMultipleDiscounts: 'bool?',
  },
};

export interface BillPaymentProps {
  _id: string;
  paymentType: string;
  paymentTypeId: string;
  amount: number;
  timestamp: Date;
}

export const BillPaymentSchema: Realm.ObjectSchema = {
  name: 'BillPayment',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    paymentType: 'string',
    paymentTypeId: 'string',
    amount: 'float',
    timestamp: { type: 'date', default: Date() },
  },
};

export interface BillItemModifierProps {
  _id: string;
  modId: string;
  name: string;
  price: number;
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
};

export interface BillItemProps {
  _id: string;
  itemId: string;
  name: string;
  price: number;
  modifierId?: string;
  mods: Realm.Collection<BillItemModifierProps>;
  categoryId: string;
  categoryName: string;
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
    mods: { type: 'BillItemModifier[]', default: [] },
    categoryId: 'string',
    categoryName: 'string',
  },
};

export interface BillDiscountProps {
  _id: string;
  name: string;
  amount: number;
  isPercent: boolean;
}
export const BillDiscountSchema: Realm.ObjectSchema = {
  name: 'BillDiscount',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    discountId: 'string',
    name: 'string',
    amount: 'float',
    isPercent: 'bool',
  },
};

export interface BillProps {
  _id: string;
  items: Realm.Collection<BillItemProps>;
  payments: Realm.Collection<BillPaymentProps>;
  timestamp: Date;
  discount: Realm.Collection<BillDiscountProps>;
  tab: number;
  isClosed: boolean;
}

export const BillSchema: Realm.ObjectSchema = {
  name: 'Bill',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    items: { type: 'BillItem[]', default: [] },
    payments: { type: 'BillPayment[]', default: [] },
    timestamp: { type: 'date', default: Date() },
    discounts: { type: 'BillDiscount[]', default: [] },
    tab: 'int',
    isClosed: { type: 'bool', default: false, indexed: true },
    billPeriod: 'BillPeriod',
  },
};

export interface BillPeriodProps {
  _id: string;
  opened: Date;
  closed: Date;
}

export const BillPeriodSchema: Realm.ObjectSchema = {
  name: 'BillPeriod',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    opened: { type: 'date', default: Date() },
    closed: 'date?',
  },
};

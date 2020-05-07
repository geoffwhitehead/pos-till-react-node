import Realm from 'realm';

export interface ItemProps {
  _id: string;
  name: string;
  categoryId: Realm.Collection<CategoryProps>;
  price: number;
  modifierId?: Realm.Collection<ModifierProps>;
  linkedPrinters: Realm.Collection<PrinterProps>;
}

export interface PriceGroupItemProps {
  // _id: string;
  groupId: PriceGroupProps;
  price: number;
}

export const PriceGroupItemSchema: Realm.ObjectSchema = {
  name: 'PriceGroupItem',
  // primaryKey: '_id',
  properties: {
    // _id: 'string',
    groupId: 'PriceGroup',
    price: 'float',
  },
};

export interface PriceGroupProps {
  _id: string;
  name: string;
}

export const PriceGroupSchema: Realm.ObjectSchema = {
  name: 'PriceGroup',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    name: 'string',
  },
};

export const ItemSchema: Realm.ObjectSchema = {
  name: 'Item',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    name: 'string',
    categoryId: 'Category',
    price: 'PriceGroupItem[]',
    modifierId: { type: 'Modifier', optional: true },
    linkedPrinters: 'Printer[]',
  },
};

export interface PrinterProps {
  _id: string;
  name: string;
  type: string;
  address: string;
}

export const PrinterSchema: Realm.ObjectSchema = {
  name: 'Printer',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    name: 'string',
    type: 'string',
    address: 'string',
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
    price: 'PriceGroupItem[]',
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
    name: 'string', // TODO: this should be unique - not currently supported in realm
    amount: 'float',
    isPercent: 'bool',
  },
};

export interface OrganizationProps {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: AddressProps;
}

export const OrganizationSchema: Realm.ObjectSchema = {
  name: 'Organization',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    name: 'string',
    email: 'string',
    phone: 'string',
    address: 'Address',
  },
};

export interface AddressProps {
  _id: string;
  line1: string;
  line2: string;
  city: string;
  county: string;
  postcode: string;
}

export const AddressSchema: Realm.ObjectSchema = {
  name: 'Address',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    line1: 'string',
    line2: 'string',
    city: 'string',
    county: 'string',
    postcode: 'string',
  },
};
// _id: 'string',
//     name: 'string',
//     line1: 'string',
//     line2: { type: 'string', optional: true },
//     city: 'string',
//     county: 'string',
//     postcode: 'NE61 1BA',
//     // }
//     vat: '123 345 567',
//     // settings: {
//     currency: '£',
//     defaultPriceGroupId: '5e90eae405a18b11edbf3214',

export interface BillPaymentProps {
  _id: string;
  paymentType: string;
  paymentTypeId: string;
  amount: number;
  timestamp: Date;
  isChange: Boolean;
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
    isChange: { type: 'bool', default: false },
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
  priceGroup: PriceGroupProps;
}

export const BillItemSchema: Realm.ObjectSchema = {
  name: 'BillItem',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    itemId: 'string',
    name: 'string',
    price: 'float', // TODO: it might be better for all prices to be a PriceGroupItem. This is a large refactor though.
    // modifierId: 'string?',
    mods: { type: 'BillItemModifier[]', default: [] },
    categoryId: 'string',
    categoryName: 'string',
    priceGroup: 'PriceGroup', // TODO: it might be better for all prices to be a PriceGroupItem. This is a large refactor though
  },
};

export interface BillDiscountProps {
  _id: string;
  discountId: string;
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
  discounts: Realm.Collection<BillDiscountProps>;
  tab: number;
  isClosed: boolean;
  closedAt?: Date;
  billPeriod: BillPeriodProps;
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
    closedAt: 'date?',
    billPeriod: { type: 'BillPeriod' },
  },
};

export interface BillPeriodProps {
  _id: string;
  opened: Date;
  closed?: Date;
}

export const BillPeriodSchema: Realm.ObjectSchema = {
  name: 'BillPeriod',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    opened: 'date',
    closed: 'date?',
  },
};

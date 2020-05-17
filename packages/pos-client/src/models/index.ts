import { Model, Q } from '@nozbe/watermelondb';
import {
  relation,
  action,
  immutableRelation,
  nochange,
  lazy,
  field,
  children,
  readonly,
  date,
} from '@nozbe/watermelondb/decorators';

export const tNames = {
  modifiers: 'modifiers',
  modifier_revisions: 'modifier_revisions',
  price_groups: 'price_groups',
  item_prices: 'item_prices',
  modifier_prices: 'modifier_prices',
  modifier_price_revisions: 'modifier_price_revisions',
  payment_types: 'payment_types',
  modifier_items: 'modifier_items',
  modifier_item_revisions: 'modifier_item_revisions',
  discounts: 'discounts',
  discount_revisions: 'discount_revisions',
  organizations: 'organizations',
  printers: 'printers',
  categories: 'categories',
  item_printers: 'item_printers',
  items: 'items',
  item_revisions: 'item_revisions'
};

class Item extends Model {
  static table = tNames.items;

  @field('name') name;
  @field('category_id') categoryId;
  @field('modifier_id') modifierId;

  @relation(tNames.categories, 'category_id') category;
  @relation(tNames.modifiers, 'modifier_id') modifier;

  static associations = {
    [tNames.item_printers]: { type: 'has_many', foreignKey: 'item_id' },
    [tNames.modifiers]: { type: 'belongs_to', key: 'modifier_id' },
    [tNames.categories]: { type: 'belongs_to', key: 'category_id' },
  };

  // @ts-ignore
  @lazy printers = this.collections.get(tNames.printers).query(Q.on(tNames.item_printers, 'item_id', this.id));
}

class ItemPrinter extends Model {
  static table = tNames.item_printers;

  @field('item_id') itemId;
  @field('printerId') printerId;

  @relation(tNames.items, 'item_id') item;
  @relation(tNames.printers, 'printer_id') printer;

  static associations = {
    [tNames.items]: { type: 'belongs_to', key: 'item_id' },
    [tNames.printers]: { type: 'belongs_to', key: 'printer_id' },
  };
}

class Category extends Model {
  static table = tNames.categories;

  @children(tNames.items) items;

  @field('name') name;

  static associations = {
    [tNames.items]: { type: 'has_many', foreignKey: 'category_id' },
  };

  // getCategory = () => {
  //   return {
  //     name: this.name,
  //   };
  // };

  // updateCategory = async updatedCategory => {
  //   await this.update(category => {
  //     category.name = updatedCategory.name;
  //   });
  // };

  // deleteCategory = async () => {
  //   await this.markAsDeleted();
  // };
}

class Printer extends Model {
  static table = 'printers';

  @field('name') name;
  @field('type') type;
  @field('address') address;

  static associations = {
    [tNames.item_printers]: { type: 'has_many', foreignKey: 'printer_id' },
  };
  // @ts-ignore

  @lazy items = this.collections.get(tNames.items).query(Q.on(tNames.item_printers, 'printer_id', this.id));
}

class Modifier extends Model {
  static table = tNames.modifiers;

  @field('name') name;

  static associations = {
    [tNames.modifier_items]: { type: 'belongs_to', foreignKey: 'modifier_id' },
    [tNames.items]: { type: 'belongs_to', foreignKey: 'modifier_id' },
  };
}

class ModifierPrice extends Model {
  static table = tNames.modifier_prices;

  @field('price') price;
  @field('price_group_id') priceGroupId;
  @field('modifier_item_revision_id') modifierItemId;
  @field('revision') revision;

  @relation(tNames.price_groups, 'price_group_id') priceGroup;
  @relation(tNames.modifier_item_revisions, 'modifier_item_revision_id') modifierItem;
}

class ModifierPriceRevision extends Model {
  static table = tNames.modifier_price_revisions;

  @field('price') price;
  @field('price_group_id') priceGroupId;
  @field('modifier_item_revision_id') modifierItemId;
  @field('revision') revision;

  @relation(tNames.price_groups, 'price_group_id') priceGroup;
  @relation(tNames.modifier_item_revisions, 'modifier_item_revision_id') modifierItem;
}


class PriceGroup extends Model {
  static table = tNames.price_groups;

  @field('name') name;
}

class ItemPrice extends Model {
  static table = tNames.item_prices;

  @field('price') price;
  @field('price_group_id') priceGroupId;
  @field('item_id') itemId;

  @relation(tNames.price_groups, 'price_group_id') priceGroup;
  @relation(tNames.items, 'item_id') item;
}

class PaymentType extends Model {
  static table = tNames.payment_types;

  @nochange @field('name') name;

  static associations = {
    [n.billPayments]: { type: 'has_many', foreignKey: 'payment_type_id' },
  };
}

class ModifierItem extends Model {
  static table = tNames.modifier_items;

  @field('name') name;
  @field('modifier_id') modifierId;

  @relation(tNames.modifiers, 'modifier_id') modifier;
}

class Discount extends Model {
  static table = tNames.discounts;

  @field('name') name;
  @field('amount') amount;
  @field('is_percent') isPercent;
}

class Organization extends Model {
  static table = tNames.organizations;
}

// BILLS

const n = {
  billPayments: 'bill_payments',
  bills: 'bills',
  billDiscounts: 'bill_discounts',
};
class BillPayment extends Model {
  static table = n.billPayments;

  @nochange @field('payment_type_id') paymentTypeId;
  @nochange @field('amount') amount;
  @nochange @field('is_change') isChange; // TODO: update to credit / debit

  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;

  static associations = {
    [n.bills]: { type: 'belongs_to', key: 'bill_id' },
    [tNames.payment_types]: { type: 'belongs_to', key: 'payment_type_id' },
  };

  @immutableRelation(tNames.payment_types, 'payment_type_id') paymentType;
  @immutableRelation(n.bills, 'bill_id') bill;
}

class Bill extends Model {
  static table = n.bills;

  @field('reference') reference;
  @field('is_closed') isClosed;
  @nochange @field('bill_period_id') billPeriodId;
  @date('closed_at') closedAt;

  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;

  @immutableRelation(n.billPeriods, 'bill_period_id') billPeriod;

  static associations = {
    [n.billPeriods]: { type: 'belongs_to', key: 'bill_period_id' },
    [n.billPayments]: { type: 'has_many', foreignKey: 'bill_id' },
    [n.billItems]: { type: 'has_many', foreignKey: 'bill_id' },
    [n.billDiscounts]: { type: 'has_many', foreignKey: 'bill_id' },
  };
}

class BillDiscount extends Model {
  static table = n.billDiscounts;

  @nochange @field('name') name;
  @nochange @field('bill_id') billId;
  @nochange @field('amount') amount;
  @nochange @field('is_percent') isPercent;

  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;

  @immutableRelation(n.bills, 'bill_id') bill;

  static associations = {
    [n.bills]: { type: 'belongs_to', key: 'bill_id' },
  };
}

class BillPeriod extends Model {
  static table = n.billPeriods;

  @date('closed_at')
  @readonly
  @date('created_at')
  createdAt;

  static associations = {
    [n.bills]: { type: 'has_many', foreignKey: 'bill_period_id' },
  };
}

export const models = [
  Item,
  ItemPrinter,
  Category,
  Printer,
  Modifier,
  ModifierItem,
  PriceGroup,
  ItemPrice,
  ModifierPrice,
  PaymentType,
  Discount,
  Organization,
];

export const Models = {
  Item,
  ItemPrinter,
  Category,
  Printer,
  Modifier,
  ModifierItem,
  PriceGroup,
  ItemPrice,
  ModifierPrice,
  PaymentType,
  Discount,
  Organization,
};

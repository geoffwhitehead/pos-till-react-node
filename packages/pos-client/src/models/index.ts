import { Model, Q } from '@nozbe/watermelondb';
import { relation, action, lazy, field } from '@nozbe/watermelondb/decorators';

export const tNames = {
  modifiers: 'modifiers',
  price_groups: 'price_groups',
  item_prices: 'item_prices',
  modifier_prices: 'modifier_prices',
  payment_types: 'payment_types',
  modifier_items: 'modifier_items',
  discounts: 'discounts',
  organizations: 'organizations',
  printers: 'printers',
  categories: 'categories',
  item_printers: 'item_printers',
  items: 'items',
};

class Item extends Model {
  // @ts-ignore
  @relation(tNames.categories, 'category_id') category;
  // @ts-ignore
  @relation(tNames.modifiers, 'modifier_id') modifier;
  static table = tNames.items;
  static associations = {
    [tNames.item_printers]: { type: 'has_many', foreignKey: 'item_id' },
    [tNames.modifiers]: {type: 'belongs_to', key: 'modifier_id'}
  };

  // @ts-ignore
  @lazy 
  printers = this.collections.get(tNames.printers).query(Q.on(tNames.item_printers, 'item_id', this.id));
}

class ItemPrinter extends Model {
  static table = tNames.item_printers;
  static associations = {
    [tNames.items]: { type: 'belongs_to', key: 'item_id' },
    [tNames.printers]: { type: 'belongs_to', key: 'printer_id' },
  };
}

class Category extends Model {
  static table = tNames.categories;

  getCategory = () => {
    return {
      name: this.name,
    };
  };

  updateCategory = async updatedCategory => {
    await this.update(category => {
      category.name = updatedCategory.name;
    });
  };

  deleteCategory = async () => {
    await this.markAsDeleted();
  };
}

class Printer extends Model {
  static table = 'printers';

  static associations = {
    [tNames.item_printers]: { type: 'has_many', foreignKey: 'printer_id' },
  };
  // @ts-ignore

  @lazy items = this.collections.get(tNames.items).query(Q.on(tNames.item_printers, 'printer_id', this.id));
}

class Modifier extends Model {
  static table = tNames.modifiers;
  static associations = {
    [tNames.modifier_items]: { type: 'belongs_to', foreignKey: 'modifier_id' },
    [tNames.items]: { type: 'belongs_to', foreignKey: 'modifier_id' },
  };
}

class PriceGroup extends Model {
  static table = tNames.price_groups;
}

class ItemPrice extends Model {
  static table = tNames.item_prices;
  @relation(tNames.price_groups, 'price_group_id') priceGroup;
  @relation(tNames.items, 'item_id') item;
}
class ModifierPrice extends Model {
  static table = tNames.modifier_prices;
  @relation(tNames.price_groups, 'price_group_id') priceGroup;
  @relation(tNames.modifier_items, 'modifier_item_id') modifierItem;
}
class PaymentType extends Model {
  static table = tNames.payment_types;
}

class ModifierItem extends Model {
  static table = tNames.modifier_items;

  @relation(tNames.modifiers, 'modifier_id') modifier;
}

class Discount extends Model {
  static table = tNames.discounts;
}

class Organization extends Model {
  static table = tNames.organizations;
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

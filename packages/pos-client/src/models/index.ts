import { Model } from '@nozbe/watermelondb';
import { relation, lazy, field } from '@nozbe/watermelondb/decorators';

class Item extends Model {
  // @ts-ignore
  @relation('categories', 'category_id') category;
  // @ts-ignore
  @relation('modifiers', 'modifier_id') modifier;
  static table = 'items';
  static associations = {
    item_printers: { type: 'has_many', foreignKey: 'item_id' },
  };

  // @ts-ignore
  @lazy printers = this.collections.get('printers').query(Q.on('item_printers', 'item_id', this.id));
}

class ItemPrinter extends Model {
  static table = 'item_printers';
  static associations = {
    items: { type: 'belongs_to', key: 'item_id' },
    printers: { type: 'belongs_to', key: 'printer_id' },
  };
  // @ts-ignore
  @field('item_id') itemId;
  // @ts-ignore
  @field('printer_id') printerId;
}

class Category extends Model {
  static table = 'categories';

  @field('name') name;

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
    item_printers: { type: 'has_many', foreignKey: 'printer_id' },
  };
  // @ts-ignore

  @lazy items = this.collections.get('items').query(Q.on('item_printers', 'printer_id', this.id));
}

class Modifier extends Model {
  static table = 'modifiers';
}

class PriceGroup extends Model {
  static table = 'price_groups';
}

class ItemPrice extends Model {
  static table = 'item_prices';
  @relation('price_groups', 'price_group_id') priceGroup;
  @relation('items', 'item_id') item;
}
class ModifierPrice extends Model {
  static table = 'modifier_prices';
  @relation('price_groups', 'price_group_id') priceGroup;
  @relation('modifier_items', 'modifier_item_id') modifierItem;
}
class PaymentType extends Model {
  static table = 'payment_types';
}

class ModifierItem extends Model {
  static table = 'modifier_items';
  @relation('modifier', 'modifier_id') modifier;
}

class Discount extends Model {
  static table = 'discounts';
}

class Organization extends Model {
  static table = 'organizations';
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

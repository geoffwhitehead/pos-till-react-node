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
import dayjs from 'dayjs';
import { uniq } from 'lodash';
import { resolvePrice } from '../helpers';
import catchFn from '../pages/Main/catchFn';

export const tNames = {
  modifiers: 'modifiers',
  itemModifiers: 'item_modifiers',
  priceGroups: 'price_groups',
  itemPrices: 'item_prices',
  modifierPrices: 'modifier_prices',
  paymentTypes: 'payment_types',
  modifierItems: 'modifier_items',
  discounts: 'discounts',
  organizations: 'organizations',
  printers: 'printers',
  categories: 'categories',
  itemPrinters: 'item_printers',
  items: 'items',
  billPayments: 'bill_payments',
  bills: 'bills',
  billDiscounts: 'bill_discounts',
  billPeriods: 'bill_periods',
  billItems: 'bill_items',
  billItemModifiers: 'bill_item_modifiers',
  billItemModifierItems: 'bill_item_modifier_items',
};

class Item extends Model {
  static table = tNames.items;

  @field('name') name;
  @field('category_id') categoryId;

  @relation(tNames.categories, 'category_id') category;

  static associations = {
    [tNames.itemPrinters]: { type: 'has_many', foreignKey: 'item_id' },
    [tNames.itemModifiers]: { type: 'has_many', foreignKey: 'item_id' },
    [tNames.modifiers]: { type: 'belongs_to', key: 'modifier_id' },
    [tNames.categories]: { type: 'belongs_to', key: 'category_id' },
    [tNames.itemPrices]: { type: 'has_many', foreignKey: 'item_id' },
  };

  // price = async (priceGroupId: string) => {
  //   return this.collections
  //     .get(tNames.itemPrices)
  //     .query(Q.and(Q.where('item_id', this.id), Q.where('price_group_id', priceGroupId)));
  // };

  @children(tNames.itemPrices) prices;

  // price = async priceGroupId => {
  //   return this.collections
  //     .get(tNames.itemPrices)
  //     .query(Q.and(Q.where('item_id', this.id), Q.where('price_group_id', priceGroupId)));
  // };
  // modifierItemPrices = async();
  // @ts-ignore
  @lazy printers = this.collections.get(tNames.printers).query(Q.on(tNames.itemPrinters, 'item_id', this.id));
  @lazy modifiers = this.collections.get(tNames.modifiers).query(Q.on(tNames.itemModifiers, 'item_id', this.id));
}

class ItemModifier extends Model {
  static table = tNames.itemModifiers;

  @field('item_id') itemId;
  @field('modifier_id') modifierId;

  @relation(tNames.items, 'item_id') item;
  @relation(tNames.modifiers, 'modifier_id') modifier;

  static associations = {
    [tNames.items]: { type: 'belongs_to', key: 'item_id' },
    [tNames.modifiers]: { type: 'belongs_to', key: 'modifier_id' },
  };
}

class ItemPrinter extends Model {
  static table = tNames.itemPrinters;

  @field('item_id') itemId;
  @field('printer_id') printerId;

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

  @nochange @field('name') name;

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
    [tNames.itemPrinters]: { type: 'has_many', foreignKey: 'printer_id' },
  };
  // @ts-ignore

  @lazy items = this.collections.get(tNames.items).query(Q.on(tNames.itemPrinters, 'printer_id', this.id));
}

class Modifier extends Model {
  static table = tNames.modifiers;

  @field('name') name;
  @field('min_items') minItems;
  @field('max_items') maxItems;

  static associations = {
    [tNames.itemModifiers]: { type: 'has_many', foreignKey: 'modifier_id' },
    [tNames.modifierItems]: { type: 'has_many', foreignKey: 'modifier_id' },
    [tNames.items]: { type: 'belongs_to', foreignKey: 'modifier_id' },
  };

  @children(tNames.modifierItems) modifierItems;

  // prices = async () => this.collections.get(tNames.modifierPrices).query(Q.)
}

class PriceGroup extends Model {
  static table = tNames.priceGroups;

  @field('name') name;
}

class ItemPrice extends Model {
  static table = tNames.itemPrices;

  @field('price') price;
  @field('price_group_id') priceGroupId;
  @field('item_id') itemId;

  @relation(tNames.priceGroups, 'price_group_id') priceGroup;
  @relation(tNames.items, 'item_id') item;

  static associations = {
    [tNames.priceGroups]: { type: 'belongs_to', key: 'price_group_id' },
    [tNames.items]: { type: 'belongs_to', key: 'item_id' },
  };
}
class ModifierPrice extends Model {
  static table = tNames.modifierPrices;

  @field('price') price;
  @field('price_group_id') priceGroupId;
  @field('modifier_item_id') modifierItemId;

  @relation(tNames.priceGroups, 'price_group_id') priceGroup;
  @relation(tNames.modifierItems, 'modifier_item_id') modifierItem;
}
class PaymentType extends Model {
  static table = tNames.paymentTypes;

  @nochange @field('name') name;

  static associations = {
    [tNames.billPayments]: { type: 'has_many', foreignKey: 'payment_type_id' },
  };
}

class ModifierItem extends Model {
  static table = tNames.modifierItems;

  @field('name') name;
  @field('modifier_id') modifierId;

  @relation(tNames.modifiers, 'modifier_id') modifier;

  @children(tNames.modifierPrices, 'modifier_item_id') prices;

  static associations = {
    [tNames.modifierPrices]: { type: 'has_many', foreignKey: 'modifier_item_id' },
    [tNames.modifiers]: { type: 'belongs_to', key: 'modifier_id' },
  };
  // price = () => {
  //   return this.collections
  //     .get(tNames.modifierPrices)
  //     .query(Q.and(Q.where('modifier_item_id', this.id), Q.where('price_group_id', priceGroupId)));
  // };
}

class Discount extends Model {
  static table = tNames.discounts;

  @nochange @field('name') name;
  @nochange @field('amount') amount;
  @nochange @field('is_percent') isPercent;
}

class Organization extends Model {
  static table = tNames.organizations;
}

// BILLS

class BillPeriod extends Model {
  static table = tNames.billPeriods;

  @readonly @date('created_at') createdAt;
  @date('closed_at') closedAt;

  static associations = {
    [tNames.bills]: { type: 'has_many', foreignKey: 'bill_period_id' },
  };

  @children(tNames.bills) bills;

  @lazy openBills = this.bills.extend(Q.where('is_closed', Q.notEq(true)));

  createBill = async (params: { reference: number }) => {
    return this.collections.get(tNames.bills).create(bill => {
      bill.reference = params.reference;
      bill.isClosed = false;
      bill.billPeriodId = this.id;
    });
  };
}

class BillPayment extends Model {
  static table = tNames.billPayments;

  @nochange @field('payment_type_id') paymentTypeId;
  @nochange @field('amount') amount;
  @nochange @field('is_change') isChange; // TODO: update to credit / debit

  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;

  static associations = {
    [tNames.bills]: { type: 'belongs_to', key: 'bill_id' },
    [tNames.paymentTypes]: { type: 'belongs_to', key: 'payment_type_id' },
  };

  @immutableRelation(tNames.paymentTypes, 'payment_type_id') paymentType;
  @immutableRelation(tNames.bills, 'bill_id') bill;

  @action close = async () => await this.destroyPermanently();
}

class Bill extends Model {
  static table = tNames.bills;

  @field('reference') reference;
  @field('is_closed') isClosed;
  @nochange @field('bill_period_id') billPeriodId;
  @date('closed_at') closedAt;

  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;

  @immutableRelation(tNames.billPeriods, 'bill_period_id') billPeriod;

  static associations = {
    [tNames.billPeriods]: { type: 'belongs_to', key: 'bill_period_id' },
    [tNames.billPayments]: { type: 'has_many', foreignKey: 'bill_id' },
    [tNames.billItems]: { type: 'has_many', foreignKey: 'bill_id' },
    [tNames.billDiscounts]: { type: 'has_many', foreignKey: 'bill_id' },
  };

  @children(tNames.billPayments) billPayments;
  @children(tNames.billDiscounts) billDiscounts;
  @children(tNames.billItems) _billItems;

  @lazy billItems = this._billItems.extend(Q.where('is_voided', false));
  @lazy billItemVoids = this._billItems.extend(Q.where('is_voided', true));

  @action addPayment = async (p: { paymentType: string; amount: number; isChange?: boolean }) => {
    const { paymentType, amount, isChange } = p;
    await this.collections.get(tNames.billPayments).create(payment => {
      payment.paymentType.set(paymentType);
      payment.bill.set(this);
      Object.assign(payment, {
        amount,
        isChange: isChange || false,
      });
    });
  };

  @action addDiscount = async (p: { discount }) => {
    console.log('discount', p.discount);
    await this.collections.get(tNames.billDiscounts).create(discount => {
      discount.bill.set(this);
      discount.discount.set(p.discount);
    });
  };

  @action addItem = async (p: { item; priceGroup }) => {
    const { item, priceGroup } = p;

    // console.log('item', item);
    const [category, prices] = await Promise.all([item.category.fetch(), item.prices.fetch()]);

    const newItem = await this.database.action(() =>
      this.collections.get(tNames.billItems).create(billItem => {
        billItem.bill.set(this);
        billItem.priceGroup.set(priceGroup);
        billItem.category.set(category);
        billItem.item.set(item);
        Object.assign(billItem, {
          itemName: item.name,
          itemPrice: resolvePrice(priceGroup, prices),
          priceGroupName: priceGroup.name,
          categoryName: category.name,
        });
      }),
    );

    return newItem;
  };

  @action close = async () =>
    await this.update(bill => {
      bill.isClosed = true;
    });
}

class BillDiscount extends Model {
  static table = tNames.billDiscounts;

  @nochange @field('bill_id') billId;
  @nochange @field('discount_id') discountId;
  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;

  @immutableRelation(tNames.bills, 'bill_id') bill;
  @immutableRelation(tNames.discounts, 'discount_id') discount;

  static associations = {
    [tNames.bills]: { type: 'belongs_to', key: 'bill_id' },
    [tNames.discounts]: { type: 'belongs_to', key: 'discount_id' },
  };

  @action void = async () => await this.destroyPermanently();
}

class BillItem extends Model {
  static table = tNames.billItems;
  @nochange @field('bill_id') billId;
  @nochange @field('item_id') itemId;
  @nochange @field('item_name') itemName;
  @nochange @field('item_price') itemPrice;
  @nochange @field('price_group_name') priceGroupName;
  @nochange @field('price_group_id') priceGroupId;
  // @nochange @field('modifier_id') modifierId;
  // @nochange @field('modifier_name') modifierName;
  @nochange @field('category_id') categoryId;
  @nochange @field('category_name') categoryName;
  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;
  @field('is_voided') isVoided;

  @immutableRelation(tNames.bills, 'bill_id') bill;
  @immutableRelation(tNames.items, 'item_id') item;
  @immutableRelation(tNames.priceGroups, 'price_group_id') priceGroup;
  @immutableRelation(tNames.categories, 'category_id') category;
  // @immutableRelation(tNames.modifiers, 'modifier_id') modifier;

  @children(tNames.billItemModifierItems) _billItemModifierItems;
  @lazy billItemModifierItems = this._billItemModifierItems.extend(Q.where('is_voided', false));
  @lazy billItemModifierItemVoids = this._billItemModifierItems.extend(Q.where('is_voided', true));
  @children(tNames.billItemModifiers) billItemModifiers;
  // @children(tNames.itemModifiers) modifiers;

  @action void = async () => {
    const modifierItemsToVoid = await this.billItemModifierItems.fetch();

    await modifierItemsToVoid.map(async modifierItem => await this.subAction(modifierItem.void));

    await this.update(billItem => {
      billItem.isVoided = true;
    });
  };

  @action addModifierChoices = async (modifier, modifierItems, priceGroup) => {
    const toCreate = [];

    const billItemModifierToCreate = this.collections.get(tNames.billItemModifiers).prepareCreate(billItemModifier => {
      billItemModifier.modifier.set(modifier);
      billItemModifier.billItem.set(this);
      Object.assign(billItemModifier, {
        modifierName: modifier.name,
      });
    });

    const billItemModifierItemsToCreate = await Promise.all(
      await modifierItems.map(async modifierItem => {
        const prices = await modifierItem.prices.fetch();
        const mItem = this.collections.get(tNames.billItemModifierItems).prepareCreate(billItemModifierItem => {
          billItemModifierItem.billItem.set(this);
          billItemModifierItem.modifierItem.set(modifierItem);
          billItemModifierItem.billItemModifier.set(billItemModifierToCreate);
          Object.assign(billItemModifierItem, {
            modifierItemName: modifierItem.name,
            modifierItemPrice: resolvePrice(priceGroup, prices),
            isVoided: false,
            // billItemModifierId: billItemModifierToCreate.id,
          });
        });
        return mItem;
      }),
    );
    toCreate.push(billItemModifierToCreate, ...billItemModifierItemsToCreate);

    await this.database.action(async () => {
      await this.database.batch(...toCreate);
    });
  };

  static associations = {
    [tNames.bills]: { type: 'belongs_to', key: 'bill_id' },
    [tNames.items]: { type: 'belongs_to', key: 'item_id' },
    [tNames.priceGroups]: { type: 'belongs_to', key: 'price_group_id' },
    // [tNames.modifiers]: { type: 'has_many', key: 'modifier_id' },
    [tNames.categories]: { type: 'belongs_to', key: 'category_id' },
    [tNames.billItemModifierItems]: { type: 'has_many', foreignKey: 'bill_item_id' },
    [tNames.billItemModifiers]: { type: 'has_many', foreignKey: 'bill_item_id' },
  };
}

class BillItemModifier extends Model {
  static table = tNames.billItemModifiers;

  @nochange @field('bill_item_id') billItemId;
  @nochange @field('modifier_name') modifierName;
  @nochange @field('modifier_id') modifierId;

  @immutableRelation(tNames.modifiers, 'modifier_id') modifier;
  @immutableRelation(tNames.billItems, 'bill_item_id') billItem;

  @children(tNames.billItemModifierItems) _billItemModifierItems;
  @lazy billItemModifierItems = this._billItemModifierItems.extend(Q.where('is_voided', false));
  @lazy billItemModifierItemVoids = this._billItemModifierItems.extend(Q.where('is_voided', true));

  static associations = {
    [tNames.billItems]: { type: 'belongs_to', key: 'bill_item_id' },
    [tNames.modifiers]: { type: 'belongs_to', key: 'modifier_id' },
    [tNames.billItemModifierItems]: { type: 'has_many', key: 'bill_item_modifier_id' },
  };
}

class BillItemModifierItem extends Model {
  static table = tNames.billItemModifierItems;

  @nochange @field('bill_item_id') billItemId;
  @nochange @field('bill_item_modifier_id') billItemModifierId;
  @nochange @field('modifier_item_id') modifierItemId;
  @nochange @field('modifier_item_price') modifierItemPrice;
  @nochange @field('modifier_item_name') modifierItemName;
  @field('is_voided') isVoided;

  @immutableRelation(tNames.billItems, 'bill_item_id') billItem;
  @immutableRelation(tNames.modifierItems, 'modifier_item_id') modifierItem;
  @immutableRelation(tNames.billItemModifiers, 'bill_item_modifier_id') billItemModifier;

  static associations = {
    [tNames.billItems]: { type: 'belongs_to', key: 'bill_item_id' },
    [tNames.modifierItems]: { type: 'belongs_to', key: 'modifier_item_id' },
    [tNames.billItemModifiers]: { type: 'belongs_to', key: 'bill_item_modifier_id' },
  };

  @action void = async () =>
    await this.update(modifierItem => {
      modifierItem.isVoided = true;
    });
}

export const models = [
  Item,
  ItemModifier,
  ModifierItem,
  ItemPrinter,
  Category,
  Printer,
  Modifier,
  PriceGroup,
  ItemPrice,
  ModifierPrice,
  PaymentType,
  Discount,
  Organization,
  Bill,
  BillDiscount,
  BillItem,
  BillPayment,
  BillPeriod,
  BillItemModifierItem,
  BillItemModifier,
];

export const Models = {
  Item,
  ItemModifier,
  ModifierItem,
  ItemPrinter,
  Category,
  Printer,
  Modifier,
  PriceGroup,
  ItemPrice,
  ModifierPrice,
  PaymentType,
  Discount,
  Organization,
  Bill,
  BillDiscount,
  BillItem,
  BillPayment,
  BillPeriod,
  BillItemModifierItem,
  BillItemModifier,
};

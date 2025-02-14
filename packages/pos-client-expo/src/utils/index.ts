import { Database, Q } from '@nozbe/watermelondb';
import { flatten, groupBy, sumBy } from 'lodash';
import {
  BillDiscount,
  BillItem,
  BillItemModifierItem,
  BillPayment,
  Discount,
  PaymentType,
  PriceGroup,
  tableNames,
} from '../models';
import { CurrencyEnum } from '../models/Organization';

export const getDefaultCashDenominations = (currency: string): number[] => {
  const map = {
    [CurrencyEnum.gbp]: [500, 1000, 2000, 3000, 5000],
    [CurrencyEnum.usd]: [500, 1000, 2000, 3000, 5000],
    [CurrencyEnum.eur]: [500, 1000, 2000, 3000, 5000],
  };

  return map[currency];
};

export const formatNumber = (value: number, currency = 'gbp'): string => {
  const map = {
    [CurrencyEnum.gbp]: 'en-GB',
    [CurrencyEnum.usd]: 'en-US',
  };

  const format = map[currency] || map.gbp;

  return new Intl.NumberFormat(format, { style: 'currency', currency }).format(value / 100);
};

export const _totalDiscount = (
  total: number,
  billDiscounts: BillDiscount[],
  discounts: Discount[],
): { total: number; breakdown: ReturnType<typeof _discountBreakdown> } => {
  const breakdown = _discountBreakdown(total, billDiscounts, discounts);

  return {
    total: breakdown.reduce((acc, discount) => acc + discount.calculatedDiscount, 0),
    breakdown,
  };
};

export type DiscountBreakdownProps = {
  billDiscountId: string;
  discountId: string;
  isPercent: boolean;
  amount: number;
  name: string;
  calculatedDiscount: number;
};

export const _discountBreakdown = (
  total: number,
  billDiscounts: BillDiscount[],
  discounts: Discount[],
): DiscountBreakdownProps[] => {
  let rollingTotal = total;
  const lookupDiscount = billDiscount => discounts.find(discount => discount.id === billDiscount.discountId);

  const arrDiscounts = billDiscounts.map(billDiscount => {
    const { isPercent, amount, name, id } = lookupDiscount(billDiscount);
    const calculatedDiscount = isPercent ? Math.round(rollingTotal * (amount / 100)) : amount;
    rollingTotal = rollingTotal - calculatedDiscount;
    return {
      billDiscountId: billDiscount.id,
      discountId: id,
      isPercent,
      amount,
      name,
      calculatedDiscount,
    };
  });
  return arrDiscounts;
};

interface ItemsBreakdownProps {
  item: BillItem;
  mods: BillItemModifierItem[];
  total: number;
}

export const itemsBreakdown = async (items: BillItem[]): Promise<ItemsBreakdownProps[]> => {
  // TODO: fix type
  const itemsWithModifiers: any = await Promise.all(
    items.map(async item => {
      const mods = await item.billItemModifierItems.fetch();
      return {
        item,
        mods,
        total: mods.reduce((out, mod) => out + getModifierItemPrice(mod), getItemPrice(item)),
      };
    }),
  );
  return itemsWithModifiers;
};

export const _total = async (items: any[]): Promise<{ total: number; itemsBreakdown: any }> => {
  const breakdown = await itemsBreakdown(items); // TODO: fix type
  const total = breakdown.reduce((out, item) => out + item.total, 0);
  return { total, itemsBreakdown: breakdown };
};

export const _totalPayments = (payments: any): number => {
  const amt = payments.reduce((acc, payment) => acc + payment.amount, 0);
  return amt;
};

export type BillSummary = {
  total: number;
  totalDiscount: number;
  discountBreakdown: DiscountBreakdownProps[];
  totalPayable: number;
  totalPayments: number;
  balance: number;
  itemsBreakdown: ItemsBreakdownProps[];
};
export const billSummary = async (
  billItems: BillItem[],
  billDiscounts: BillDiscount[],
  billPayments: BillPayment[],
  discounts: Discount[],
): Promise<BillSummary> => {
  const { total, itemsBreakdown } = await _total(billItems);

  const totalPayments = _totalPayments(billPayments);
  const discountBreakdown = _totalDiscount(total, billDiscounts, discounts);
  return {
    total,
    itemsBreakdown,
    totalDiscount: discountBreakdown.total,
    discountBreakdown: discountBreakdown.breakdown,
    totalPayable: total - discountBreakdown.total,
    totalPayments,
    balance: total - discountBreakdown.total - totalPayments,
  };
};

export type MinimalBillSummary = {
  totalDiscount: number;
  totalPayable: number;
  balance: number;
  discountBreakdown: DiscountBreakdownProps[];
  total: number;
};
export const minimalBillSummary = async (params: {
  chargableBillItems: BillItem[];
  billDiscounts: BillDiscount[];
  billPayments: BillPayment[];
  discounts: Discount[];
  database: Database;
}): Promise<MinimalBillSummary> => {
  const { chargableBillItems, billDiscounts, billPayments, discounts, database } = params;
  const itemTotal = sumBy(chargableBillItems, billItem => billItem.itemPrice);
  const itemIds = chargableBillItems.map(billItem => billItem.id);
  const modifierItems = ((await database.collections
    .get<BillItemModifierItem>(tableNames.billItemModifierItems)
    .query(Q.where('bill_item_id', Q.oneOf(itemIds)))) as unknown) as BillItemModifierItem[];

  const modifierItemTotal = sumBy(modifierItems, modifierItem => modifierItem.modifierItemPrice);

  const total = modifierItemTotal + itemTotal;

  const totalPayed = sumBy(billPayments, billPayment => billPayment.amount);

  const discountBreakdown = _totalDiscount(total, billDiscounts, discounts);

  return {
    total,
    totalDiscount: discountBreakdown.total,
    discountBreakdown: discountBreakdown.breakdown,
    totalPayable: total - discountBreakdown.total,
    balance: total - discountBreakdown.total - totalPayed,
  };
};

// type TransactionSummary = {
//   total: number;
//   paymentMethods: string[];
// };

export const getItemPrice = (billItem: BillItem) => (billItem.isComp ? 0 : billItem.itemPrice);

export const getModifierItemPrice = (modifierItem: BillItemModifierItem) =>
  modifierItem.isComp ? 0 : modifierItem.modifierItemPrice;

// export const transactionSummary = (
//   billItems,
//   billItemModifierItems,
//   billDiscounts,
//   billPayments,
//   paymentTypes,
// ): TransactionSummary => {
//   const modifierTotal = billItemModifierItems.reduce(
//     (out, modifierItem) => out + getModifierItemPrice(modifierItem),
//     0,
//   );
//   const itemTotal = billItems.reduce((out, billItem) => out + getItemPrice(billItem), 0);
//   const billDiscountsTotal = billDiscounts.reduce((out, billDiscount) => out + billDiscount.closingAmount, 0);
//   const lookupPaymentType = id => paymentTypes.find(pT => pT.id === id).name;
//   const paymentMethods = uniq(billPayments.map(bP => bP.paymentTypeId)).map(lookupPaymentType);
//   return {
//     total: modifierTotal + itemTotal - billDiscountsTotal,
//     paymentMethods,
//   };
// };

export type TransactionSummary = {
  discountTotal: number;
  paymentsTotal: number;
  paymentBreakdown: { paymentTypeId: string; totalPayed: number }[];
  changeTotal: number;
  total: number;
};

export const transactionSummary = async (params: {
  chargableBillItems: BillItem[];
  billDiscounts: BillDiscount[];
  billPayments: BillPayment[];
  database: Database;
}): Promise<TransactionSummary> => {
  const { chargableBillItems, billDiscounts, billPayments, database } = params;

  const itemTotal = sumBy(chargableBillItems, billItem => billItem.itemPrice);

  const itemIds = chargableBillItems.map(billItem => billItem.id);
  const modifierItems = ((await database.collections
    .get<BillItemModifierItem>(tableNames.billItemModifierItems)
    .query(Q.where('bill_item_id', Q.oneOf(itemIds)))) as unknown) as BillItemModifierItem[];

  const modifierItemTotal = sumBy(modifierItems, modifierItem => modifierItem.modifierItemPrice);

  const total = modifierItemTotal + itemTotal;

  const paymentGroups = groupBy(billPayments, payment => payment.paymentTypeId);

  const paymentsTotal = sumBy(billPayments, payment => payment.amount);
  const discountTotal = sumBy(billDiscounts, discount => discount.closingAmount);
  const changePayments = billPayments.filter(billPayment => billPayment.isChange);
  const changeTotal = sumBy(changePayments, changePayment => Math.abs(changePayment.amount));
  const paymentBreakdown = Object.keys(paymentGroups).map(keyPaymentGroup => {
    return {
      paymentTypeId: keyPaymentGroup,
      totalPayed: sumBy(paymentGroups[keyPaymentGroup], payment => payment.amount),
    };
  });

  // const change = total - discountTotal - paymentsTotal;

  return {
    discountTotal,
    paymentsTotal,
    paymentBreakdown,
    changeTotal: changeTotal || 0,
    total,
  };
};

export const paymentSummary = (periodPayments: BillPayment[], paymentTypes: PaymentType[]) => {
  const groupedPayments = groupBy(periodPayments, 'paymentTypeId');
  const paymentTotals = paymentTypes.map(pT => ({
    name: pT.name,
    count: groupedPayments[pT.id] ? groupedPayments[pT.id].length : 0,
    total: groupedPayments[pT.id] ? groupedPayments[pT.id].reduce((out, payment) => out + payment.amount, 0) : 0,
  }));
  return { breakdown: paymentTotals, total: sumBy(paymentTotals, 'total'), count: sumBy(paymentTotals, 'count') };
};

export const finalizedDiscountSummary = (periodBillDiscounts: BillDiscount[], discounts: Discount[]) => {
  const groupedDiscounts = groupBy(periodBillDiscounts, 'discountId');
  const discountTotals = discounts.map(d => ({
    name: d.name,
    count: groupedDiscounts[d.id] ? groupedDiscounts[d.id].length : 0,
    total: groupedDiscounts[d.id]
      ? groupedDiscounts[d.id].reduce((out, discount) => out + discount.closingAmount, 0)
      : 0,
  }));
  return { breakdown: discountTotals, total: sumBy(discountTotals, 'total'), count: sumBy(discountTotals, 'count') };
};

export const categorySummary = (billItems: BillItem[]) => {
  const groupedBillItems = groupBy(billItems, bI => bI.categoryId);

  const totals = Object.keys(groupedBillItems).map(key => ({
    categoryId: key,
    count: groupedBillItems[key].length,
    total: groupedBillItems[key].reduce((out, item) => out + getItemPrice(item), 0),
  }));

  return { breakdown: totals, count: sumBy(totals, 'count'), total: sumBy(totals, 'total') };
};

// TODO: look at refactoring and improving performance of this function
export const modifierSummary = (billItemModifierItems: BillItemModifierItem[]) => {
  // group all the items by their modifier name
  const groupedModifierItems = groupBy(billItemModifierItems, mI => mI.modifierId);

  const groups = flatten(
    Object.keys(groupedModifierItems).map(modifierIdKey => {
      const modifierGroup = groupedModifierItems[modifierIdKey];

      const groupedNames = groupBy(modifierGroup, 'modifierName');

      return Object.keys(groupedNames).map(modifierNameKey => {
        const modifier = groupedNames[modifierNameKey];

        const modifierItems = groupBy(modifier, 'modifierItemName');

        const breakdown = Object.keys(modifierItems).map(modifierItemNameKey => {
          const modifierItemGroup = modifierItems[modifierItemNameKey];

          return {
            modifierItemName: modifierItemNameKey,
            total: sumBy(modifierItemGroup, mI => getModifierItemPrice(mI)),
            count: modifierItemGroup.length,
          };
        });
        return {
          modifierId: modifierIdKey,
          modifierName: modifierNameKey,
          breakdown,
          total: sumBy(breakdown, 'total'),
          count: sumBy(breakdown, 'count'),
        };
      });
    }),
  );

  return { breakdown: groups, count: sumBy(groups, 'count'), total: sumBy(groups, 'total') };
};

export const priceGroupSummmary = (
  billItems: BillItem[],
  billItemModifierItems: BillItemModifierItem[],
  priceGroups: PriceGroup[],
) => {
  const itemsGrouped = groupBy(billItems, 'priceGroupId');
  const modifiersGrouped = groupBy(billItemModifierItems, 'priceGroupId');
  const itemBreakdown = priceGroups.map(({ name, id }) => {
    return {
      name,
      priceGroupId: id,
      total: itemsGrouped[id] ? sumBy(itemsGrouped[id], item => getItemPrice(item)) : 0,
      count: itemsGrouped[id] ? itemsGrouped[id].length : 0,
    };
  });
  const modifierItemBreakdown = priceGroups.map(({ name, id }) => {
    return {
      name,
      priceGroupId: id,
      total: modifiersGrouped[id] ? sumBy(modifiersGrouped[id], mI => getModifierItemPrice(mI)) : 0,
      count: modifiersGrouped[id] ? modifiersGrouped[id].length : 0,
    };
  });
  const totals = priceGroups.map(({ name, id }) => {
    const itemRecord = itemBreakdown.find(b => b.priceGroupId === id);
    const modifierRecord = modifierItemBreakdown.find(b => b.priceGroupId === id);
    return {
      name,
      total: itemRecord.total + modifierRecord.total,
      count: itemRecord.count + modifierRecord.count,
    };
  });

  return totals;
};

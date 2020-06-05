import {
  BillDiscountProps,
  BillItemProps,
  BillProps,
  PaymentTypeProps,
  BillPaymentProps,
  DiscountProps,
  CategoryProps,
  BillItemModifierProps,
} from '../services/schemas';
import { Collection } from 'realm';
import { flatten, uniq, groupBy, sumBy } from 'lodash';

// // TODO fix tpyes
// export const total = (p: { items; discounts }): number => {
//   const amt = bill.items.reduce((acc, item) => {
//     const mods = item.mods.reduce((acc, mod) => acc + mod.price, 0);
//     return acc + mods + item.price;
//   }, 0);
//   return amt;
// };

// export const totalPayable: (bill: BillProps) => number = bill => {
//   return total(bill) - totalDiscount(bill);
// };

// // TODO fix tpyes
// export const balance = (bill: BillProps): number => {
//   return total(bill) - totalDiscount(bill) - totalPayments(bill);
// };

// interface DiscountBreakdownItemProps extends BillDiscountProps {
//   calculatedDiscount: number;
// }
// // fix types
// export const discountBreakdown: (bill: BillProps) => DiscountBreakdownItemProps[] = bill => {
//   let rollingTotal = total(bill);
//   const arrDiscounts = bill.discounts.map(d => {
//     const calculatedDiscount = d.isPercent ? Math.round(rollingTotal * (d.amount / 100)) : d.amount;
//     rollingTotal = rollingTotal - calculatedDiscount;
//     return {
//       ...d,
//       calculatedDiscount,
//     };
//   });
//   return arrDiscounts;
// };

// export const discountBreakdownBills: (bills: Collection<BillProps>) => DiscountBreakdownItemProps[] = bills =>
//   flatten(bills.map(bill => discountBreakdown(bill)));

// export const billCategoryTotals: (bill: BillProps) => Record<string, number> = bill => {
//   return bill.items.reduce(
//     (acc, item) => ({
//       ...acc,
//       [item.categoryId]: (acc[item.categoryId] || 0) + totalBillItem(item),
//     }),
//     {},
//   );
// };

// export const billsItemCount: (bills: Collection<BillProps>) => number = bills =>
//   bills.map(bill => bill.items.length).reduce((acc, count) => acc + count);

// export const billItemsCategoryTotals: (
//   bills: Collection<BillProps>,
//   categories: Collection<CategoryProps>,
// ) => Record<string, number> = (bills, categories) => {
//   const itemCategoriesObject: Record<string, number> = categories.reduce(
//     (acc, category) => ({ ...acc, [category._id]: 0 }),
//     {},
//   );

//   const billCategoryBreakdowns = bills.map(bill => billCategoryTotals(bill));

//   return billCategoryBreakdowns.reduce((acc, billBreakdown) => {
//     return Object.keys(billBreakdown).reduce(
//       (totals, categoryId) => ({ ...totals, [categoryId]: totals[categoryId] + billBreakdown[categoryId] }),
//       { ...acc },
//     );
//   }, itemCategoriesObject);
// };

// export const discountBreakdownTotals = (bills: Collection<BillProps>, discounts: Collection<DiscountProps>) => {
//   const discountTotalsObject: Record<string, number> = discounts.reduce(
//     (acc, discount) => ({ ...acc, [discount._id]: 0 }),
//     {},
//   );

//   const discountsBreakdown = discountBreakdownBills(bills);

//   const totals = discountsBreakdown.reduce((acc, discount) => {
//     return { ...acc, [discount.discountId]: acc[discount.discountId] + discount.calculatedDiscount };
//   }, discountTotalsObject);
//   return totals;
// };

// export const totalBillPaymentBreakdown: (
//   payments: Collection<BillPaymentProps>,
//   paymentTypes: Collection<PaymentTypeProps>,
// ) => Record<string, number> = (payments, paymentTypes) => {
//   const paymentTypesObject: Record<string, number> = paymentTypes.reduce(
//     (acc, paymentType) => ({ ...acc, [paymentType._id]: 0 }),
//     {},
//   );
//   return payments.reduce((acc, payment) => {
//     return { ...acc, [payment.paymentTypeId]: acc[payment.paymentTypeId] + payment.amount };
//   }, paymentTypesObject);
// };

// export const totalBillsPaymentBreakdown: (
//   bills: Collection<BillProps>,
//   paymentTypes: Collection<PaymentTypeProps>,
// ) => Record<string, number> = (bills, paymentTypes) => {
//   const paymentTypesObject: Record<string, number> = paymentTypes.reduce(
//     (acc, paymentType) => ({ ...acc, [paymentType._id]: 0 }),
//     {},
//   );

//   const paymentBreakdowns = bills.map(bill => totalBillPaymentBreakdown(bill.payments, paymentTypes));

//   const totalPayments = paymentBreakdowns.reduce((acc, breakdown) => {
//     return Object.keys(breakdown).reduce(
//       (totals, typeId) => {
//         return { ...totals, [typeId]: totals[typeId] + breakdown[typeId] };
//       },
//       { ...acc },
//     );
//   }, paymentTypesObject);

//   return totalPayments;
// };

// export const totalBillItem = (item: BillItemProps) =>
//   (item.mods?.reduce((acc, mod) => acc + mod.price, 0) || 0) + item.price;

// export const totalDiscount: (bill: BillProps) => number = bill =>
//   discountBreakdown(bill).reduce((acc, discount) => acc + discount.calculatedDiscount, 0);

// export const totalBillsDiscount: (bills: BillProps[]) => number = bills =>
//   bills.reduce((total, bill) => totalDiscount(bill), 0);

// // TODO fix tpyes
// export const totalPayments: (bill: BillProps) => number = bill => {
//   const amt = bill.payments.reduce((acc, payment) => {
//     return acc + payment.amount;
//   }, 0);
//   return amt;
// };

export const formatNumber: (value: number, symbol?: string) => string = (value, symbol = '') =>
  `${symbol}${(value ? value / 100 : 0).toFixed(2)}`;

export const _totalDiscount = (
  total,
  billDiscounts,
  discounts,
): { total: number; breakdown: ReturnType<typeof _discountBreakdown> } => {
  const breakdown = _discountBreakdown(total, billDiscounts, discounts);

  return {
    total: breakdown.reduce((acc, discount) => acc + discount.calculatedDiscount, 0),
    breakdown,
  };
};

export const _discountBreakdown = (total: number, billDiscounts: any, discounts): DiscountBreakdownItemProps[] => {
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

export const itemsBreakdown = async (
  items: any[],
): Promise<{ item: BillItemProps; mods: BillItemModifierProps[]; total: number }[]> => {
  // TODO: fix type
  const itemsWithModifiers: any = await Promise.all(
    items.map(async item => {
      const mods = await item.billItemModifierItems.fetch();
      return {
        item,
        mods,
        total: mods.reduce((out, mod) => out + mod.modifierItemPrice, item.itemPrice),
      };
    }),
  );
  // const total = itemsWithModifiers.reduce((out, total) => out + total, 0);
  return itemsWithModifiers;
};

export const _total = async (items: any[]): Promise<{ total: number; itemsBreakdown: any }> => {
  // TODO: fix type
  const breakdown = await itemsBreakdown(items);
  // const arrPrices: any = await Promise.all(items.map(_modifiersTotal));
  const total = breakdown.reduce((out, item) => out + item.total, 0);

  // const total = arrPrices.reduce((out, total) => out + total, 0);
  return { total, itemsBreakdown: breakdown };
};

export const _totalPayments = (payments: any): number => {
  const amt = payments.reduce((acc, payment) => acc + payment.amount, 0);
  return amt;
};

// export const _balance = async (items, discounts, payments): Promise<number> => {
//   const totalPayable = await _total(items);
//   const totalPayments = _totalPayments(payments);
//   return totalPayable - totalPayments;
// };

// const fetchModifier

export type BillSummary = {
  total: number;
  totalDiscount: number;
  discountBreakdown: ReturnType<typeof _discountBreakdown>;
  totalPayable: number;
  totalPayments: number;
  balance: number;
  itemsBreakdown: ReturnType<typeof itemsBreakdown>;
};
export const billSummary = async (billItems, billDiscounts, billPayments, discounts): Promise<BillSummary> => {
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

type TransactionSummary = {
  total: number;
  paymentMethods: string[];
};

export const transactionSummary = (
  billItems,
  billItemModifierItems,
  billDiscounts,
  billPayments,
  paymentTypes,
): TransactionSummary => {
  const modifierTotal = billItemModifierItems.reduce((out, modifierItem) => out + modifierItem.modifierItemPrice, 0);
  const itemTotal = billItems.reduce((out, billItem) => out + billItem.itemPrice, 0);
  const billDiscountsTotal = billDiscounts.reduce((out, billDiscount) => out + billDiscount.closingAmount, 0);
  const lookupPaymentType = id => paymentTypes.find(pT => pT.id === id).name;
  const paymentMethods = uniq(billPayments.map(bP => bP.paymentTypeId)).map(lookupPaymentType);
  return {
    total: modifierTotal + itemTotal - billDiscountsTotal,
    paymentMethods,
  };
};

export const paymentSummary = (periodPayments, paymentTypes) => {
  const groupedPayments = groupBy(periodPayments, 'paymentTypeId');
  const paymentTotals = paymentTypes.map(pT => ({
    name: pT.name,
    count: groupedPayments[pT.id] ? groupedPayments[pT.id].length : 0,
    total: groupedPayments[pT.id] ? groupedPayments[pT.id].reduce((out, payment) => out + payment.amount, 0) : 0,
  }));
  return { breakdown: paymentTotals, total: sumBy(paymentTotals, 'total'), count: sumBy(paymentTotals, 'count') };
};

export const finalizedDiscountSummary = (periodBillDiscounts, discounts) => {
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

export const categorySummary = billItems => {
  const groupedBillItems = groupBy(billItems, bI => bI.categoryId);

  const totals = Object.keys(groupedBillItems).map(key => ({
    categoryId: key,
    count: groupedBillItems[key].length,
    total: groupedBillItems[key].reduce((out, item) => out + item.itemPrice, 0),
  }));

  console.log('totals', totals);
  return { breakdown: totals, count: sumBy(totals, 'count'), total: sumBy(totals, 'total') };
};

export const modifierSummary = billItemModifierItems => {
  // group all the items by their modifier name
  const groupedModifierItems = groupBy(billItemModifierItems, mI => mI.modifierId);
  console.log('groupedModifierItems', groupedModifierItems);

  const groups = flatten(Object.keys(groupedModifierItems).map(modifierIdKey => {
    const modifierGroup = groupedModifierItems[modifierIdKey];

    const groupedNames = groupBy(modifierGroup, 'modifierName');
    
    return Object.keys(groupedNames).map(modifierNameKey => {
      const modifier = groupedNames[modifierNameKey];

      const modifierItems = groupBy(modifier, 'modifierItemName');

      const breakdown = Object.keys(modifierItems).map(modifierItemNameKey => {
        const modifierItemGroup = modifierItems[modifierItemNameKey]

        return {
          modifierItemName: modifierItemNameKey,
          total: sumBy(modifierItemGroup, 'modifierItemPrice'),
          count: modifierItemGroup.length
        }
      })
      return {
        modifierId: modifierIdKey,
        modifierName: modifierNameKey,
        breakdown,
        total: sumBy(breakdown, 'total'),
        count: sumBy(breakdown, 'count')
      }
    })
    // const groupedItems = groupBy(Object.values(groupedNames), 'modifierItemName')

    // const modifierItems = Object.keys(modifiers).map(modifierItem => {
    //   const modifierItemGroup
    // })
    
    // // total each bucket and append the modifier name and modifier item name
    // const totals = Object.keys(groupedNames).map(mItemNameKey => ({
    //   modifierName: modifierNameKey,
    //   modifierItemName: groupedNames[mItemNameKey][0].
    //   modifierItemId: groupedNames[mItemNameKey][0].modifierItemId,
    //   billItemModifierId: groupedNames[mItemNameKey][0].billItemModifierId,
    //   count: groupedNames[mItemNameKey].length,
    //   total: groupedNames[mItemNameKey].reduce((out, item) => out + item.modifierItemPrice, 0),
    // }));
    // return totals;
  }));




  // for each modifier group -> group all the modifier items into buckets
  // const groups = Object.keys(groupedModifierItems).map(modifierNameKey => {
  //   const groupedNames = groupBy(groupedModifierItems[modifierNameKey], mI => mI.modifierItemName);
    
  //   // total each bucket and append the modifier name and modifier item name
  //   const totals = Object.keys(groupedNames).map(mItemNameKey => ({
  //     modifierName: modifierNameKey,
  //     modifierItemName: groupedNames[mItemNameKey][0].
  //     modifierItemId: groupedNames[mItemNameKey][0].modifierItemId,
  //     billItemModifierId: groupedNames[mItemNameKey][0].billItemModifierId,
  //     count: groupedNames[mItemNameKey].length,
  //     total: groupedNames[mItemNameKey].reduce((out, item) => out + item.modifierItemPrice, 0),
  //   }));
  //   return totals;
  // });

  // const flattenedTotals = flatten(groups);
  // const groupedByModifier = groupBy(flattenedTotals, 'billItemModifierId');
  // const breakdown = Object.keys(groupedByModifier).map(key => {
  //   const group = groupedByModifier[key];
  //   return { breakdown: group, billItemModifierId: key, total: sumBy(group, 'total'), count: sumBy(group, 'count') };
  // });
  return { breakdown: groups, count: sumBy(groups, 'count'), total: sumBy(groups, 'total') };
};

export const priceGroupSummmary = (billItems, billItemModifierItems, priceGroups) => {
  const itemsGrouped = groupBy(billItems, 'priceGroupId');
  const modifiersGrouped = groupBy(billItemModifierItems, 'priceGroupId');
  const itemBreakdown = priceGroups.map(({ name, id }) => {
    return {
      name,
      priceGroupId: id,
      total: itemsGrouped[id] ? sumBy(itemsGrouped[id], 'itemPrice') : 0,
      count: itemsGrouped[id] ? itemsGrouped[id].length : 0,
    };
  });
  const modifierItemBreakdown = priceGroups.map(({ name, id }) => {
    return {
      name,
      priceGroupId: id,
      total: modifiersGrouped[id] ? sumBy(modifiersGrouped[id], 'modifierItemPrice') : 0,
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

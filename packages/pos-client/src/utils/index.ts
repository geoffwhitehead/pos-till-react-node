import {
  BillDiscountProps,
  BillItemProps,
  BillProps,
  PaymentTypeProps,
  BillPaymentProps,
  DiscountProps,
  CategoryProps,
} from '../services/schemas';
import { Collection } from 'realm';
import { flatten } from 'lodash';

// TODO fix tpyes
export const total = (p: { items; discounts }): number => {
  const amt = bill.items.reduce((acc, item) => {
    const mods = item.mods.reduce((acc, mod) => acc + mod.price, 0);
    return acc + mods + item.price;
  }, 0);
  return amt;
};

export const totalPayable: (bill: BillProps) => number = bill => {
  return total(bill) - totalDiscount(bill);
};

// TODO fix tpyes
export const balance = (bill: BillProps): number => {
  return total(bill) - totalDiscount(bill) - totalPayments(bill);
};

interface DiscountBreakdownItemProps extends BillDiscountProps {
  calculatedDiscount: number;
}
// fix types
export const discountBreakdown: (bill: BillProps) => DiscountBreakdownItemProps[] = bill => {
  let rollingTotal = total(bill);
  const arrDiscounts = bill.discounts.map(d => {
    const calculatedDiscount = d.isPercent ? Math.round(rollingTotal * (d.amount / 100)) : d.amount;
    rollingTotal = rollingTotal - calculatedDiscount;
    return {
      ...d,
      calculatedDiscount,
    };
  });
  return arrDiscounts;
};

export const discountBreakdownBills: (bills: Collection<BillProps>) => DiscountBreakdownItemProps[] = bills =>
  flatten(bills.map(bill => discountBreakdown(bill)));

export const billCategoryTotals: (bill: BillProps) => Record<string, number> = bill => {
  return bill.items.reduce(
    (acc, item) => ({
      ...acc,
      [item.categoryId]: (acc[item.categoryId] || 0) + totalBillItem(item),
    }),
    {},
  );
};

export const billsItemCount: (bills: Collection<BillProps>) => number = bills =>
  bills.map(bill => bill.items.length).reduce((acc, count) => acc + count);

export const billItemsCategoryTotals: (
  bills: Collection<BillProps>,
  categories: Collection<CategoryProps>,
) => Record<string, number> = (bills, categories) => {
  const itemCategoriesObject: Record<string, number> = categories.reduce(
    (acc, category) => ({ ...acc, [category._id]: 0 }),
    {},
  );

  const billCategoryBreakdowns = bills.map(bill => billCategoryTotals(bill));

  return billCategoryBreakdowns.reduce((acc, billBreakdown) => {
    return Object.keys(billBreakdown).reduce(
      (totals, categoryId) => ({ ...totals, [categoryId]: totals[categoryId] + billBreakdown[categoryId] }),
      { ...acc },
    );
  }, itemCategoriesObject);
};

export const discountBreakdownTotals = (bills: Collection<BillProps>, discounts: Collection<DiscountProps>) => {
  const discountTotalsObject: Record<string, number> = discounts.reduce(
    (acc, discount) => ({ ...acc, [discount._id]: 0 }),
    {},
  );

  const discountsBreakdown = discountBreakdownBills(bills);

  const totals = discountsBreakdown.reduce((acc, discount) => {
    return { ...acc, [discount.discountId]: acc[discount.discountId] + discount.calculatedDiscount };
  }, discountTotalsObject);
  return totals;
};

export const totalBillPaymentBreakdown: (
  payments: Collection<BillPaymentProps>,
  paymentTypes: Collection<PaymentTypeProps>,
) => Record<string, number> = (payments, paymentTypes) => {
  const paymentTypesObject: Record<string, number> = paymentTypes.reduce(
    (acc, paymentType) => ({ ...acc, [paymentType._id]: 0 }),
    {},
  );
  return payments.reduce((acc, payment) => {
    return { ...acc, [payment.paymentTypeId]: acc[payment.paymentTypeId] + payment.amount };
  }, paymentTypesObject);
};

export const totalBillsPaymentBreakdown: (
  bills: Collection<BillProps>,
  paymentTypes: Collection<PaymentTypeProps>,
) => Record<string, number> = (bills, paymentTypes) => {
  const paymentTypesObject: Record<string, number> = paymentTypes.reduce(
    (acc, paymentType) => ({ ...acc, [paymentType._id]: 0 }),
    {},
  );

  const paymentBreakdowns = bills.map(bill => totalBillPaymentBreakdown(bill.payments, paymentTypes));

  const totalPayments = paymentBreakdowns.reduce((acc, breakdown) => {
    return Object.keys(breakdown).reduce(
      (totals, typeId) => {
        return { ...totals, [typeId]: totals[typeId] + breakdown[typeId] };
      },
      { ...acc },
    );
  }, paymentTypesObject);

  return totalPayments;
};

export const totalBillItem = (item: BillItemProps) =>
  (item.mods?.reduce((acc, mod) => acc + mod.price, 0) || 0) + item.price;

export const totalDiscount: (bill: BillProps) => number = bill =>
  discountBreakdown(bill).reduce((acc, discount) => acc + discount.calculatedDiscount, 0);

export const totalBillsDiscount: (bills: BillProps[]) => number = bills =>
  bills.reduce((total, bill) => totalDiscount(bill), 0);

// TODO fix tpyes
export const totalPayments: (bill: BillProps) => number = bill => {
  const amt = bill.payments.reduce((acc, payment) => {
    return acc + payment.amount;
  }, 0);
  return amt;
};

export const formatNumber: (value: number, symbol?: string) => string = (value, symbol = '') =>
  `${symbol}${(value ? value / 100 : 0).toFixed(2)}`;

// ****************
// ****************
// ****************
// ****************
// ****************

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

const _modifiersTotal = async item => {
  const modifierItems = await item.billItemModifierItems.fetch();
  const prices = modifierItems.reduce((out, mItem) => out + mItem.modifierItemPrice, item.itemPrice);
  return prices;
};

export const _total = async (items: any[]): Promise<number> => {
  // TODO: fix type
  const arrPrices: any = await Promise.all(items.map(_modifiersTotal));
  const total = arrPrices.reduce((out, total) => out + total, 0);
  return total;
};

export const _totalPayments = (payments: any): number => {
  const amt = payments.reduce((acc, payment) => acc + payment.amount, 0);
  console.log('amt', amt);
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
};
export const billSummary = async (billItems, billDiscounts, billPayments, discounts): Promise<BillSummary> => {
  const total = await _total(billItems);
  const totalPayments = _totalPayments(billPayments);
  const discountBreakdown = _totalDiscount(total, billDiscounts, discounts);
  return {
    total,
    totalDiscount: discountBreakdown.total,
    discountBreakdown: discountBreakdown.breakdown,
    totalPayable: total - discountBreakdown.total,
    totalPayments,
    balance: total - discountBreakdown.total - totalPayments,
  };
};

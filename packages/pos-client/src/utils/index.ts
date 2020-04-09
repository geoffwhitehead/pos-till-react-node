import { BillDiscountProps, BillItemProps } from '../services/schemas';
import { Items } from '../pages/Items/Items';

// TODO fix tpyes
export const total: (bill: any) => number = bill => {
  const amt = bill.items.reduce((acc, item) => {
    const mods = item.mods.reduce((acc, mod) => acc + mod.price, 0);
    return acc + mods + item.price;
  }, 0);
  return amt;
};

export const totalPayable: (bill: any) => number = bill => {
  return total(bill) - totalDiscount(bill);
};

// TODO fix tpyes
export const balance: (bill: any) => number = bill => {
  return total(bill) - totalDiscount(bill) - totalPayments(bill);
};

interface DiscountBreakdownItemProps extends BillDiscountProps {
  calculatedDiscount: number;
}
// fix types
export const discountBreakdown: (bill: any) => DiscountBreakdownItemProps[] = bill => {
  let rollingTotal = total(bill);
  const arrDiscounts = bill.discounts.map(d => {
    const calculatedDiscount = d.isPercent ? Math.round(rollingTotal * (d.amount / 100)) : d.amount;
    rollingTotal = rollingTotal - calculatedDiscount;
    return {
      _id: d._id,
      name: d.name,
      amount: d.amount,
      isPercent: d.isPercent,
      calculatedDiscount,
    };
  });
  return arrDiscounts;
};

export const totalBillItem = (item: BillItemProps) => item.mods.reduce((acc, mod) => acc + mod.price, 0) + item.price;

export const totalDiscount: (bill: any) => number = bill =>
  discountBreakdown(bill).reduce((acc, discount) => acc + discount.calculatedDiscount, 0);

// TODO fix tpyes
export const totalPayments: (bill: any) => number = bill => {
  const amt = bill.payments.reduce((acc, payment) => {
    return acc + payment.amount;
  }, 0);
  return amt;
};

export const formatNumber: (value: number, symbol?: string) => string = (value, symbol = '') =>
  `${symbol}${(value / 100).toFixed(2)}`;

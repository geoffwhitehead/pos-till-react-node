import uuidv4 from 'uuid/v4';

export enum paymentTypeNames {
  CASH = 'cash',
  CARD = 'card',
  VOUCHER = 'voucher',
}
// Mock API for now...
export const getPaymentTypes = () => {
  return new Promise((resolve, reject) => {
    resolve({
      data: [
        {
          _id: uuidv4(),
          name: paymentTypeNames.CASH,
        },
        {
          _id: uuidv4(),
          name: paymentTypeNames.CARD,
        },
        {
          _id: uuidv4(),
          name: paymentTypeNames.VOUCHER,
        },
      ],
    });
  });
};

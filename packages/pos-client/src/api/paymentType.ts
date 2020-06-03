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
      ok: true,
      data: {
        success: true,
        data: [
          {
            _id: '123aksciukn2i3knkcnw',
            name: paymentTypeNames.CASH,
          },
          {
            _id: '1jk32kjhsfn23fkjhn4',
            name: paymentTypeNames.CARD,
          },
          {
            _id: 'akjnsdfuwknerk32nj3c',
            name: paymentTypeNames.VOUCHER,
          },
        ],
      },
    });
  });
};

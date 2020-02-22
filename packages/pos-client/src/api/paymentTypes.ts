import uuidv4 from 'uuid/v4';

// Mock API for now...
export const getPaymentTypes = () => {
  return new Promise((resolve, reject) => {
    resolve({
      data: [
        {
          _id: uuidv4(),
          name: 'Cash',
        },
        {
          _id: uuidv4(),
          name: 'Card',
        },
        {
          _id: uuidv4(),
          name: 'Voucher',
        },
      ],
    });
  });
};

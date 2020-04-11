// Mock API for now...
export const getOrganization = () => {
  return new Promise((resolve, reject) => {
    resolve({
      data: {
        _id: 1,
        name: 'Nadon Thai Restaurant',
        line1: '12a Newgate St',
        line2: '',
        city: 'Morpeth',
        county: 'Northumberland',
        postcode: 'NE61 1BA',
        vat: '123 345 567',
        settings: {
          currency: '£',
          defaultPriceGroupId: '5e90eae405a18b11edbf3214',
        },
      },
    });
  });
};

// TODO: not currently using

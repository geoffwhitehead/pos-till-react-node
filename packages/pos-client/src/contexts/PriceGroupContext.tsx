import React from 'react';

type PriceGroupContextProps = {
  setPriceGroup: (priceGroup: any) => void;
  priceGroup: any;
};

export const PriceGroupContext = React.createContext<PriceGroupContextProps>({
  setPriceGroup: null,
  priceGroup: null,
});

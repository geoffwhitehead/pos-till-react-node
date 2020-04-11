import React from 'react';
import { PriceGroupProps } from '../services/schemas';

type PriceGroupContextProps = {
  setPriceGroup: (priceGroup: PriceGroupProps) => void;
  priceGroup: PriceGroupProps;
};

export const PriceGroupContext = React.createContext<PriceGroupContextProps>({
  setPriceGroup: null,
  priceGroup: null,
});

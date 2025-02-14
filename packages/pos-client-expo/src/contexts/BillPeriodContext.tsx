import React from 'react';
import { BillPeriod } from '../models/BillPeriod';

type BillPeriodContextProps = {
  setBillPeriod: (billPeriod: BillPeriod) => void;
  billPeriod: BillPeriod;
};
export const BillPeriodContext = React.createContext<BillPeriodContextProps>({
  setBillPeriod: () => {},
  billPeriod: null,
});

import React from 'react';
import { BillPeriodProps } from '../services/schemas';

type BillPeriodContextProps = {
  setBillPeriod: (billPeriod: BillPeriodProps) => void;
  billPeriod: BillPeriodProps; // TODO fix
};
export const BillPeriodContext = React.createContext<BillPeriodContextProps>({
  setBillPeriod: null,
  billPeriod: null,
});

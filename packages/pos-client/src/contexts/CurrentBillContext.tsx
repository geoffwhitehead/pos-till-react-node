import React from 'react';
import { BillProps } from '../services/schemas';

type CurrentBillContextProps = {
  setCurrentBill: (bill: BillProps) => void;
  currentBill: BillProps; // TODO fix
};
export const CurrentBillContext = React.createContext<CurrentBillContextProps>({
  setCurrentBill: () => {},
  currentBill: null,
});

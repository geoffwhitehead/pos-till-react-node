import React from 'react';
import { Bill } from '../models/Bill';

type CurrentBillContextProps = {
  setCurrentBill: (bill: Bill) => void;
  currentBill: Bill;
};
export const CurrentBillContext = React.createContext<CurrentBillContextProps>({
  setCurrentBill: () => {},
  currentBill: null,
});

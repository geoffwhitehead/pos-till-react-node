import React from 'react';

type CurrentBillContextProps = {
  setCurrentBill: (bill: any) => void;
  currentBill: any; // TODO fix
};
export const CurrentBillContext = React.createContext<CurrentBillContextProps>({
  setCurrentBill: () => {},
  currentBill: null,
});

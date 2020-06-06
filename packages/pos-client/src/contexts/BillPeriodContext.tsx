import React from 'react';

type BillPeriodContextProps = {
  setBillPeriod: (billPeriod: any) => void;
  billPeriod: any; // TODO fix
};
export const BillPeriodContext = React.createContext<BillPeriodContextProps>({
  setBillPeriod: () => {},
  billPeriod: null,
});

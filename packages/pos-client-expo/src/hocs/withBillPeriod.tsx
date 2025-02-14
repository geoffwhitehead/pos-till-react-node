import React, { useContext } from 'react';
import { BillPeriodContext } from '../contexts/BillPeriodContext';

// TODO: remove this / refactor
export const withBillPeriod = Component => {
  return function component(props) {
    const { billPeriod, setBillPeriod } = useContext(BillPeriodContext);
    return <Component {...props} billPeriod={billPeriod} setBillPeriod={setBillPeriod} />;
  };
};

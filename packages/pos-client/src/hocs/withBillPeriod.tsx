import React, { useContext } from 'react';
import { BillPeriodContext } from '../contexts/BillPeriodContext';

export const withBillPeriod = Component => {
  return function component(props) {
    const { billPeriod, setBillPeriod } = useContext(BillPeriodContext);
    return <Component {...props} billPeriod={billPeriod} setBillPeriod={setBillPeriod} />;
  };
};

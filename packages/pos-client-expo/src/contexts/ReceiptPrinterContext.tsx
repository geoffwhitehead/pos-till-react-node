import React from 'react';
import { Printer } from '../models/Printer';

type ReceiptPrinterContextProps = {
  setReceiptPrinter: (printer: Printer) => void;
  receiptPrinter: Printer;
};
export const ReceiptPrinterContext = React.createContext<ReceiptPrinterContextProps>({
  setReceiptPrinter: () => {},
  receiptPrinter: null,
});

import { api } from './index';

export const getPrinterGroups = () => api.get<PrinterGroupServerProps>('/printer-groups', {});

export interface PrinterGroupServerProps {
  _id: string;
  name: string;
  printers: string[];
}

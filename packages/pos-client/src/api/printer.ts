import { api } from './index';

export const getPrinters = () => api.get<PrinterServerProps>('/printers', {});
export interface PrinterServerProps {
  _id: string;
  name: string;
  type?: string;
  address?: string;
}

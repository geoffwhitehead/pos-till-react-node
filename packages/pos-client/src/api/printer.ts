import { Api } from './index';

export const getPrinters = () => Api.get<PrinterServerProps>('/printers', {});
export interface PrinterServerProps {
  _id: string;
  name: string;
  type?: string;
  address?: string;
}

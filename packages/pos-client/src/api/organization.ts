import { api } from './index';

export const getOrganization = () =>
  api.get<OrganizationServerProps>(`/organization`);
export interface OrganizationServerProps {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  vat?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    county: string;
    postcode: string;
  };
  settings?: {
    defaultPriceGroupId?: string;
    receiptPrinterId?: string;
    currency?: string;
    maxBills?: number;
  };
  syncId: string
}

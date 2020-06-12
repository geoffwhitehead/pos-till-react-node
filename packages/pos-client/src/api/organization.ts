import { api } from './index';

export const getOrganization = (organizationId: string) =>
  api.get<OrganizationServerProps>(`/organization/${organizationId}`);
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
    defaultPriceGroup?: string;
    receiptPrinter?: string;
    currency: string;
    maxBills: number;
  };
}

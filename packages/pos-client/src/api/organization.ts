import { api } from './index';

export const getOrganization = (organizationId: string) =>
  api.get<OrganizationServerProps>(`/organization/${organizationId}`);
export interface OrganizationServerProps {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  vat?: string;
  defaultPriceGroup?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    county: string;
    postcode: string;
  };
}

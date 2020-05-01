import { Api } from './index';

export const getOrganization = () => Api.get<OrganizationServerProps>('/organization', {});
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

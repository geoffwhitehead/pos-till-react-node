import { api } from './index';

export type SignInParams = { email: string; password: string };
export const signIn = (params: SignInParams): Promise<any> => api.post('/auth/signin', params);

export type SignUpParams = (params: {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  name: string;
  phone: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    county: string;
    postcode: string;
  };
}) => Promise<any>;

export const signUp = (params: SignUpParams): Promise<any> => api.post('/auth/signup', params);

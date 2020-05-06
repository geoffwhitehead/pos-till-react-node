import { api } from './index';

type SignInProps = (params: { email: string; password: string }) => Promise<any>;
export const signIn: SignInProps = params => api.post('/auth/signin', params);

type SignUpProps = (params: { firstName: string; lastName: string; password: string; email: string }) => Promise<any>;

export const signUp: SignUpProps = params => api.post('/auth/signup', params);

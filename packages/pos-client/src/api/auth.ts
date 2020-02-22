import { Api } from './index'

type SignInProps = (params: { email: string, password: string }) => Promise<any>
export const signIn: SignInProps = (params) => Api.post('/auth/login', params)

type SignUpProps = (params: {
  firstName: string,
  lastName: string,
  password: string,
  email: string,
}) => Promise<any>

export const signUp: SignUpProps = (params) => Api.post('/auth/register', params)

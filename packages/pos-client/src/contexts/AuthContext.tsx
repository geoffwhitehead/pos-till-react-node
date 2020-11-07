import React from 'react';

type AuthContextProps = {
  signIn: (data: any) => void;
  signOut: () => void;
  signUp: (data: any) => void;
};
export const AuthContext = React.createContext<AuthContextProps>({
  signIn: async data => {},
  signOut: () => {},
  signUp: async data => {},
});

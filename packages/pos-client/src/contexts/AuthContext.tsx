import React from 'react';

type AuthContextProps = {
  signIn: (data: any) => void;
  signOut: () => void;
  signUp: (data: any) => Promise<{ success: boolean }>;
  unlink: () => any;
};
export const AuthContext = React.createContext<AuthContextProps>({
  signIn: async data => {},
  signOut: () => {},
  signUp: async data => {},
  unlink: () => {},
});

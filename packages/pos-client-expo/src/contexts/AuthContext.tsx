import React from 'react';

type AuthContextProps = {
  signIn: (data: any) => void;
  signOut: () => void;
  signUp: (data: any) => Promise<{ success: boolean }>;
  unlink: () => any;
  isSignUpLoading: boolean;
  isSignInLoading: boolean;
};
export const AuthContext = React.createContext<AuthContextProps>({
  signIn: async () => {},
  signOut: () => {},
  signUp: async () => {
    return { success: false };
  },
  unlink: () => {},
  isSignInLoading: false,
  isSignUpLoading: false,
});

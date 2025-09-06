
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../types';
import { getUserByUsername } from '../db/idb';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string): Promise<boolean> => {
    // In a real app, you'd check a password and get a token.
    // Here, we're just fetching a user from IndexedDB by username.
    // Default users are 'admin' and 'employee'.
    const foundUser = await getUserByUsername(username);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

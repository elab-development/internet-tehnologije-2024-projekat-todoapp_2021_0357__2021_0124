import React, { createContext, useState, useEffect, type ReactNode } from 'react';

interface AuthContextType {
  user: any; // Definisacemo kasnije User model
  token: string | null;
  login: (userData: any, token: string) => void;
  register: (data: any) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // Posle ovde moze kod za dobavljanje podataka o korisniku na osnovu tokena
    }
  }, []);

  const login = (userData: any, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
  };

  const register = (data: any) => {
    // Registracija kod
  };

  const logout = () => {
    // Logout kod
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

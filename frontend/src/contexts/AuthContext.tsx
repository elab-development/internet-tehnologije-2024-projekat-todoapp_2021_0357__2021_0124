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

  const logout = async () => {
    try {
      // brisanje tokena na serveru
      if (token) {
        await fetch('http://localhost:8080/api/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // brisanje brisanje tokena i korisnika iz localStorage
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

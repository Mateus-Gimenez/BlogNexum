'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '@/services/api';

interface DecodedToken {
  nameid: string; // ID do usuário
  name: string;   // Nome do usuário
  exp: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: { id: string; nome: string } | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: string; nome: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          setUser({ id: decodedToken.nameid, nome: decodedToken.name });
          api.defaults.headers.Authorization = `Bearer ${token}`;
        } else {
          logout();
        }
      } catch (error) {
        console.error("Falha ao decodificar token inicial:", error);
        logout();
      }
    }
  }, []);

  const login = (token: string) => {
    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      console.log('Token Decodificado no Login:', decodedToken);
      localStorage.setItem('token', token);
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setIsAuthenticated(true);
      setUser({ id: decodedToken.nameid, nome: decodedToken.name });
    } catch (error) {
      console.error("Falha ao processar login:", error);
      logout(); // Garante que o estado fique limpo se o token for inválido
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.Authorization;
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

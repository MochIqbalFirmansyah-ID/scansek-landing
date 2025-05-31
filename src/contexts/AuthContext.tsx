import { createContext, useState, useCallback, ReactNode } from 'react';
import { mockLogin, mockLogout } from '../services/authService';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  checkAuth: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => ({ success: false, message: 'Not implemented' }),
  logout: () => {},
  checkAuth: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if user is already logged in
  const checkAuth = useCallback(() => {
    setIsLoading(true);
    const storedUser = localStorage.getItem('scansek_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        setUser(null);
        localStorage.removeItem('scansek_user');
      }
    }
    setIsLoading(false);
  }, []);
  
  // Login handler
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const result = await mockLogin(email, password);
    if (result.success && result.user) {
      setUser(result.user);
      localStorage.setItem('scansek_user', JSON.stringify(result.user));
    }
    setIsLoading(false);
    return { success: result.success, message: result.message };
  };
  
  // Logout handler
  const logout = () => {
    mockLogout();
    setUser(null);
    localStorage.removeItem('scansek_user');
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
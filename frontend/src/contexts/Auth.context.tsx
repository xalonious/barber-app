import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useContext,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { loginUser } from '../api/auth';

interface AuthContextProps {
  isAuthed: boolean;
  user: { id: number; email: string; name: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

interface DecodedToken {
  sub: string;
  email: string;
  name: string;
  exp: number;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<{
    id: number;
    email: string;
    name: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const storedCustomerId = localStorage.getItem('customerId');
    if (token && storedCustomerId) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);

        if (decoded.exp * 1000 < Date.now()) {
          console.warn('Token has expired.');
          localStorage.removeItem('jwtToken');
          localStorage.removeItem('customerId');
        } else {
          setUser({
            id: parseInt(decoded.sub, 10),
            email: decoded.email,
            name: decoded.name,
          });
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('customerId');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        const { token, id, email: userEmail, name } = await loginUser(
          email,
          password
        );

        localStorage.setItem('jwtToken', token);
        localStorage.setItem('customerId', id.toString());
        setUser({ id, email: userEmail, name });

        toast.success('Inloggen succesvol!');

        return true;
      } catch (error: any) {
        console.error('Inloggen mislukt:', error);

        if (error.response?.status === 401) {
          toast.error('Ongeldige e-mail of wachtwoord.');
        } else if (error.response?.status >= 500) {
          toast.error('Serverfout. Probeer het later opnieuw.');
        } else {
          toast.error(
            'Er is een netwerkfout opgetreden. Controleer uw verbinding en probeer het opnieuw.'
          );
        }
        return false;
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('customerId');
    setUser(null);
    navigate('/');
    toast.info('U bent uitgelogd.');
  }, [navigate]);

  const value = useMemo(
    () => ({
      isAuthed: !!user,
      user,
      login,
      logout,
      isLoading,
    }),
    [user, login, logout, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

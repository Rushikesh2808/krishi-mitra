import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, UserRole } from '../types';
import { DEMO_USERS } from '../data/authDemoData';

interface AuthContextType {
  currentUser: UserAccount | null;
  isAuthenticated: boolean;
  loginAsDemo: (role: UserRole) => void;
  login: (mobile: string, password: string, role: UserRole) => { success: boolean; error?: string };
  register: (user: UserAccount) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (updatedData: Partial<UserAccount>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'krishimitra_active_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load user from localStorage', e);
    }
    // Default to demo Farmer for seamless exploration, but auth system fully supports login/register
    return DEMO_USERS.FARMER;
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save user to localStorage', e);
    }
  }, [currentUser]);

  const loginAsDemo = (role: UserRole) => {
    const demoUser = DEMO_USERS[role];
    setCurrentUser(demoUser);
  };

  const login = (mobile: string, _password: string, role: UserRole) => {
    if (!mobile || mobile.length < 10) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number' };
    }

    // In prototype: match with demo account or create session
    const demoUser = DEMO_USERS[role];
    const userToLogin: UserAccount = {
      ...demoUser,
      mobile,
    };

    setCurrentUser(userToLogin);
    return { success: true };
  };

  const register = (user: UserAccount) => {
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (role: UserRole) => {
    loginAsDemo(role);
  };

  const updateProfile = (updatedData: Partial<UserAccount>) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        ...updatedData,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save updated profile to localStorage', e);
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        loginAsDemo,
        login,
        register,
        logout,
        switchRole,
        updateProfile,
      }}
    >
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


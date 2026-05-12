'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  userId: number;
  email: string;
  type: 'individual' | 'pro' | 'company';
  role?: string;
  organizationId?: string;
  subscriptionStatus?: string;
  deletedAt?: string | null;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
  isDevBypass: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDevBypass, setIsDevBypass] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // 🛑 DEV BYPASS CHECK
    if (token === 'dev-bypass-token') {
      setIsDevBypass(true);
      setUser({
        userId: 0,
        email: 'dev@sentinel.local',
        type: 'company',
        role: 'Owner',
        subscriptionStatus: 'active',
        deletedAt: null
      });
      setIsLoading(false);
      return;
    }

    if (token) {
      fetch('http://localhost:4000/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setUser(data);
      })
      .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsDevBypass(false);
    window.location.href = '/login';
  };

  return (
    <UserContext.Provider value={{ user, isLoading, logout, isDevBypass }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

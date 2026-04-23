import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'safescope_theme_mode';

const palette = {
  light: {
    bg: '#f8fafc',
    card: '#ffffff',
    cardAlt: '#f1f5f9',
    border: '#e5e7eb',
    text: '#111827',
    sub: '#475569',
    muted: '#64748b',
    accent: '#ff6a00',
  },
  dark: {
    bg: '#050505',
    card: '#111111',
    cardAlt: '#171717',
    border: '#232323',
    text: '#ffffff',
    sub: '#cbd5e1',
    muted: '#9ca3af',
    accent: '#ff6a00',
  },
};

type ThemeContextValue = {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  dark: boolean;
  colors: typeof palette.light;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark') {
        setThemeModeState(saved);
      }
    });
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    AsyncStorage.setItem(STORAGE_KEY, mode).catch(() => {});
  };

  const value = useMemo(
    () => ({
      themeMode,
      setThemeMode,
      dark: themeMode === 'dark',
      colors: palette[themeMode],
    }),
    [themeMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useAppTheme must be used within ThemeProvider');
  return context;
}

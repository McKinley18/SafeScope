import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tokens } from './tokens';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'safescope_theme_mode';

const palette = {
  light: {
    bg: tokens.color.light.bg,
    card: tokens.color.light.card,
    cardAlt: tokens.color.light.surface,
    border: tokens.color.light.border,
    text: tokens.color.light.text,
    sub: tokens.color.light.sub,
    muted: tokens.color.light.muted,
    accent: tokens.color.light.accent,
  },
  dark: {
    bg: tokens.color.dark.bg,
    card: tokens.color.dark.card,
    cardAlt: tokens.color.dark.surface,
    border: tokens.color.dark.border,
    text: tokens.color.dark.text,
    sub: tokens.color.dark.sub,
    muted: tokens.color.dark.muted,
    accent: tokens.color.dark.accent,
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

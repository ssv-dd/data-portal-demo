import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  /**
   * When true and app theme is dark, Prism uses **DefaultThemeCollection** dark
   * (neutral/black Prism palette) with no `--app-*` overrides. InternalTools-only
   * dark stays blue-tinted; custom bridged dark uses InternalTools + overrides.
   */
  useStockPrismDark: boolean;
  setUseStockPrismDark: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'data-portal-theme';
const PRISM_STOCK_DARK_KEY = 'data-portal-prism-stock-dark';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Read from localStorage or default to 'light'
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      return (stored as Theme) || 'light';
    }
    return 'light';
  });

  const [useStockPrismDark, setUseStockPrismDarkState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(PRISM_STOCK_DARK_KEY) === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'prism-neutral-dark');
    root.classList.add(theme);
    /* App shell uses --app-* from global-styles; without this, only Prism widgets changed. */
    if (theme === 'dark' && useStockPrismDark) {
      root.classList.add('prism-neutral-dark');
    }
  }, [theme, useStockPrismDark]);

  useEffect(() => {
    localStorage.setItem(PRISM_STOCK_DARK_KEY, String(useStockPrismDark));
  }, [useStockPrismDark]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setUseStockPrismDark = useCallback((value: boolean) => {
    setUseStockPrismDarkState(value);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        useStockPrismDark,
        setUseStockPrismDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

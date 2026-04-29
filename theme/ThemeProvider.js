import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

const light = {
  mode: 'light',
  background: '#f5f7fb',
  card: '#ffffff',
  text: '#0f1724',
  muted: '#6b7280',
  primary: '#2563eb',
  border: '#e6e8ee',
  accent: '#10b981'
};

const dark = {
  mode: 'dark',
  background: '#071127',
  card: '#0b1220',
  text: '#e6eef8',
  muted: '#94a3b8',
  primary: '#60a5fa',
  border: '#1f2937',
  accent: '#34d399'
};

export function ThemeProvider({ children }) {
  const sys = useColorScheme();
  const [mode, setMode] = useState(sys === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    // follow system by default
    setMode(sys === 'dark' ? 'dark' : 'light');
  }, [sys]);

  const value = useMemo(() => ({
    theme: mode === 'dark' ? dark : light,
    mode,
    toggle: () => setMode(m => (m === 'dark' ? 'light' : 'dark'))
  }), [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

export default ThemeProvider;

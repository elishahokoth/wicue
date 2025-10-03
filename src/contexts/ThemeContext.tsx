import React, { useEffect, useState, createContext, useContext } from 'react';
type Theme = 'light' | 'dark' | 'jungle' | 'extra-dark' | 'darksacramento';
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export const ThemeProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if theme is stored in localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    // Check if user prefers dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // Validate that the saved theme is one of our options
    if (savedTheme && ['light', 'dark', 'jungle', 'extra-dark', 'darksacramento'].includes(savedTheme)) {
      return savedTheme;
    }
    return prefersDark ? 'dark' : 'light';
  });
  useEffect(() => {
    // Update localStorage when theme changes
    localStorage.setItem('theme', theme);
    // Remove all theme classes first
    document.documentElement.classList.remove('dark', 'jungle', 'extra-dark', 'darksacramento');
    // Add the appropriate class based on theme
    if (theme !== 'light') {
      document.documentElement.classList.add(theme);
    }
  }, [theme]);
  const toggleTheme = () => {
    setTheme(prevTheme => {
      // Cycle through themes: light -> dark -> jungle -> extra-dark -> darksacramento -> light
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'jungle';
      if (prevTheme === 'jungle') return 'extra-dark';
      if (prevTheme === 'extra-dark') return 'darksacramento';
      return 'light';
    });
  };
  return <ThemeContext.Provider value={{
    theme,
    toggleTheme,
    setTheme
  }}>
      {children}
    </ThemeContext.Provider>;
};
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
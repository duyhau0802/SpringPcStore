import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      className="btn btn-outline-secondary btn-sm theme-toggle"
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <i className="bi bi-sun-fill text-warning"></i>
      ) : (
        <i className="bi bi-moon-fill text-primary"></i>
      )}
    </button>
  );
};

export default ThemeToggle;

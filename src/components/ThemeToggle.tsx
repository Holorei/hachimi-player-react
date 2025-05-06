import React from 'react';
import { Theme } from '../types';
import { FaSun, FaMoon } from 'react-icons/fa';

interface ThemeToggleProps {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  return (
    <div className="top-controls">
      <button 
        className="theme-toggle" 
        onClick={toggleTheme}
        title={theme === Theme.LIGHT ? "切换到深色模式" : "切换到浅色模式"}
      >
        {theme === Theme.LIGHT ? <FaMoon /> : <FaSun />}
      </button>
    </div>
  );
}; 
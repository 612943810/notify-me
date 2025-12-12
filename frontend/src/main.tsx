import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Check for saved theme preference or use system preference
const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Function to apply theme
const applyTheme = (theme: 'light' | 'dark') => {
  const root = document.documentElement;
  
  // Remove any existing theme classes
  root.classList.remove('light', 'dark');
  
  // Add the current theme class
  root.classList.add(theme);
  
  // Set data-theme attribute for CSS custom properties
  root.setAttribute('data-theme', theme);
  
  // Ensure the class is applied to the html element
  if (!root.classList.contains(theme)) {
    root.classList.add(theme);
  }
  
  console.log('Theme applied:', theme);
};

// Initialize theme
if (savedTheme) {
  applyTheme(savedTheme);
} else {
  const theme = systemPrefersDark ? 'dark' : 'light';
  applyTheme(theme);
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!savedTheme) { // Only apply system theme if user hasn't set a preference
    const newTheme = e.matches ? 'dark' : 'light';
    applyTheme(newTheme);
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

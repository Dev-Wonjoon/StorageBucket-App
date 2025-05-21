import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const stored = localStorage.getItem('theme');
const useDarkmode = stored === 'dark'
  ? true
  : stored === 'light'
    ? false
    : window.matchMedia('(prefer-color-scheme: dark').matches;

  if (useDarkmode) {
    document.documentElement.classList.add('dark');
  }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

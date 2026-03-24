import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Initialize persisted hour font (if any) before rendering
try {
  const saved = localStorage.getItem('psaltermatic:hourFont')
  if (saved) {
    document.documentElement.style.setProperty('--hour-font', saved)
  }
// eslint-disable-next-line no-unused-vars
} catch (e) {
  // ignore localStorage errors
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

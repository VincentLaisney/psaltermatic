import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Initialize persisted hour font (if any) before rendering
try {
  const savedFont = localStorage.getItem('psaltermatic:hourFont')
  if (savedFont) {
    document.documentElement.style.setProperty('--hour-font', savedFont)
  }
  const savedFontSize = localStorage.getItem('psaltermatic:hourFontSize')
  if (savedFontSize) {
    document.documentElement.style.setProperty('--hour-font-size', savedFontSize)
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

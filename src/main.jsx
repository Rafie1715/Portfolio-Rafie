import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' 
import './index.css'
import './i18n';
import App from './App.jsx'
import { initializeAnalytics } from './utils/analytics'

// Initialize Google Analytics
initializeAnalytics();

// Global error handler untuk debugging
window.addEventListener('error', (event) => {
  console.error('Global Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element #root not found');
  throw new Error('Root element #root not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
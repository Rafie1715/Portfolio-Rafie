import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' 
import './index.css'
import './i18n';
import App from './App.jsx'

// Global error handler untuk debugging
window.addEventListener('error', (event) => {
  console.error('Global Error:', event.error);
  alert('Portfolio Error: ' + (event.error?.message || 'Unknown error'));
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
  alert('Portfolio Error: ' + (event.reason?.message || 'Unknown error'));
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  alert('Root element not found!');
  throw new Error('Root element #root not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
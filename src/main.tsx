/**
 * LILMOD - Application Entry Point
 * 
 * Renders the React application into the DOM
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Get the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Make sure there is an element with id="root" in the HTML.');
}

// Create root and render the app
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

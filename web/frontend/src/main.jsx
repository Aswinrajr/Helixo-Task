import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/build/esm/styles.css';
import App from './App';

// This is the entry point for your "Machine Task" UI preview.
// In a real Shopify app, this would be wrapped by the App Bridge provider.
ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <AppProvider i18n={enTranslations}>
      <App />
    </AppProvider>
  </React.StrictMode>
);

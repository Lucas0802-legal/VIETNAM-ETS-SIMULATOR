import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { LanguageProvider } from './context/LanguageContext';
import { SimulatorProvider } from './context/SimulatorContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <SimulatorProvider>
        <App />
      </SimulatorProvider>
    </LanguageProvider>
  </StrictMode>,
);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { EventHubProvider } from './context/EventHubContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <EventHubProvider>
      <App />
    </EventHubProvider>
  </StrictMode>,
);

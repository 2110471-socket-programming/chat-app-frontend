import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './AppRF.tsx';
import { UserProvider } from './context/UserContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>,
);

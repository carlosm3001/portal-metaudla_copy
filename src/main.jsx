import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AuthWrapper from './AuthWrapper.jsx';
import './index.css';        // Tailwind base/components/utilities
import './styles/custom.css'; // Tus variables/overrides (debe ir DESPUÉS)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthWrapper />
    </BrowserRouter>
  </React.StrictMode>,
);

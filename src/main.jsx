import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { APIProvider, AuthProvider } from './context';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <APIProvider>
          <App />
        </APIProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

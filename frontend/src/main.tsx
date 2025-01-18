import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/global.css';
import NotificationProvider from './components/NotificationProvider';
import { AuthProvider } from './contexts/Auth.context';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router> {}
      <AuthProvider>
        <NotificationProvider />
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);

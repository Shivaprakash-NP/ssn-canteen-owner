import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx'; // <-- IMPORT THIS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider> {/* <-- WRAP YOUR APP WITH THE PROVIDER */}
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { UserProvider } from './context/UserContext';
import { ItemProvider } from './context/ItemContext';



ReactDOM.render(
  <React.StrictMode>
    <ItemProvider>
    <UserProvider>
 
    <App />

    </UserProvider>
        </ItemProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

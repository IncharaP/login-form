import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { UserProvider } from './UserContext';
import { ItemProvider } from './ItemContext';



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

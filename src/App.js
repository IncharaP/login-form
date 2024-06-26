import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import AdminWelcome from './AdminWelcome';
import AddItem from './AddItem';
import EditItem from './EditItem';
import ViewUsers from './ViewUsers';
import UserWelcome from './UserWelcome';
import ViewItems from './ViewItems';
import Register from './Register'; // New component for registration
import { ItemProvider } from './ItemContext';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setLoggedIn(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setLoggedIn(false);
  };

  const onRegister = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setLoggedIn(true); // Auto-login after registration if desired
  };

  const PrivateRoute = ({ element, path }) => {
    return loggedIn ? (
      <Route path={path} element={element} />
    ) : (
      <Navigate to="/" replace />
    );
  };

  return (
    <Router>
      <div className="App">
        <ItemProvider>
          <Routes>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onRegister={onRegister} />} />
            <Route path="/admin-welcome" element={<AdminWelcome onLogout={handleLogout} />} />
            <Route path="/add-item" element={<AddItem />} />
            <Route path="/edit-item" element={<EditItem />} />
            <Route path="/view-users" element={<ViewUsers />} />
            <Route path="/user-welcome" element={<UserWelcome onLogout={handleLogout} />} />
            <Route path="/view-items" element={<ViewItems />} />
          </Routes>
        </ItemProvider>
      </div>
    </Router>
  );
};

export default App;

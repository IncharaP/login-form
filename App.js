// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import AdminWelcome from './AdminWelcome';
import AddItem from './AddItem';
import ViewItemAdmin from './ViewItemAdmin';
import ViewUsers from './ViewUsers';
import UserWelcome from './UserWelcome';
import ViewItems from './ViewItems';
import Register from './Register'; // New component for registration
import { ItemProvider } from './ItemContext';
import RequireAuth from './RequireAuth';

const ROLES = {
  'User': 'user',
  'Admin': 'admin'
}

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentSession'));
    if (user) {
      setLoggedIn(true);
      setUserRole(user.role);
    }
  }, []);

  const handleLogin = () => {
    const user = JSON.parse(localStorage.getItem('currentSession'));
    if (user) {
      setLoggedIn(true);
      setUserRole(user.role);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentSession'); // Remove only the current session information
    setLoggedIn(false);
    setUserRole(null);
  };

  const onRegister = (userData) => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    localStorage.setItem('registeredUsers', JSON.stringify([...registeredUsers, userData]));
    localStorage.setItem('currentSession', JSON.stringify(userData));
    setLoggedIn(true);
    setUserRole(userData.role);
  };

  return (
    <Router>
      <div className="App">
        <ItemProvider>
          <Routes>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onRegister={onRegister} />} />
            <Route path="/unauthorized" element={<div>Unauthorized</div>} />

            <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
              <Route path="/user-welcome" element={<UserWelcome onLogout={handleLogout} />} />
              <Route path="/view-items" element={<ViewItems />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
              <Route path="/admin-welcome" element={<AdminWelcome onLogout={handleLogout} />} />
              <Route path="/add-item" element={<AddItem />} />
              <Route path="/view-item-admin" element={<ViewItemAdmin />} />
              <Route path="/view-users" element={<ViewUsers />} />
            </Route>

            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </ItemProvider>
      </div>
    </Router>
  );
};

export default App;

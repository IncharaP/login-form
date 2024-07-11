import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import AdminWelcome from './AdminWelcome';
import AddItem from './AddItem';
import ViewItemAdmin from './ViewItemAdmin';
import EditItem from './EditItem';
import ViewUsers from './ViewUsers';
import UserWelcome from './UserWelcome';
import ViewItems from './ViewItems';
import UserOrders from './UserOrders';
import Register from './Register';
import ViewOrders from './ViewOrders';
import { ItemProvider } from './ItemContext';
import RequireAuth from './RequireAuth';
import NotFoundPage from './NotFoundPage';
import { UserProvider } from './UserContext';
import { OrdersProvider } from './OrdersContext';

const ROLES = {
  User: 'user',
  Admin: 'admin'
};

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentSession'));
    if (user) {
      setLoggedIn(true);
      setUserRole(user.role);
      setUsername(user.username);
    }
  }, []);

  const handleLogin = () => {
    const user = JSON.parse(localStorage.getItem('currentSession'));
    if (user) {
      setLoggedIn(true);
      setUserRole(user.role);
      setUsername(user.username);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentSession');
    setLoggedIn(false);
    setUserRole(null);
    setUsername('');
  };

  const onRegister = (userData) => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    localStorage.setItem('registeredUsers', JSON.stringify([...registeredUsers, userData]));

    localStorage.setItem('currentSession', JSON.stringify(userData));

    setLoggedIn(true);
    setUserRole(userData.role);
    setUsername(userData.username);
  };

  return (
    <Router>
       <OrdersProvider>
      <UserProvider>
    

        <div className="App">
          <ItemProvider>
            <Routes>
              <Route path="/" element={<Login onLogin={handleLogin} />} />
              <Route path="/register" element={<Register onRegister={onRegister} />} />
              <Route path="/unauthorized" element={<div>Unauthorized</div>} />

              <Route element={<RequireAuth allowedRoles={[ROLES.User]} onLogout={handleLogout} />}>
                <Route path="/user-welcome" element={<UserWelcome username={username} />} />
                <Route path="/view-items" element={<ViewItems />} />
                <Route path="/user-orders" element={<UserOrders />} />
              </Route>

              <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} onLogout={handleLogout} />}>
                <Route path="/admin-welcome" element={<AdminWelcome />} />
                <Route path="/add-item" element={<AddItem />} />
                <Route path="/view-item-admin" element={<ViewItemAdmin />} />
                <Route path="/edit-item/:itemId" element={<EditItem />} />
                <Route path="/view-users" element={<ViewUsers />} />
                <Route path="/view-orders" element={<ViewOrders username={username} />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ItemProvider>
        </div>
     
      </UserProvider>
      </OrdersProvider>,
  
    </Router>
  );
};

export default App;

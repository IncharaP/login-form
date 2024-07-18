// Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from './UserContext'; // Import useUser hook
import './Login.css'; // Import CSS for styling

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setCurrentUser } = useUser(); // Get setCurrentUser from context

  const handleLogin = () => {
    if (username.trim() === '' || password.trim() === '') {
      setError('Username and password cannot be empty.');
      return;
    }

    const adminUser = { username: 'admin', password: 'admin12', role: 'admin' };
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    const user = registeredUsers.find(u => u.username === username && u.password === password);

    if (username === adminUser.username && password === adminUser.password) {
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      setCurrentUser(adminUser); // Set current user in context
      navigate('/admin-welcome');
    } else if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(user); // Set current user in context
      navigate('/user-welcome');
    } else {
      setError('Invalid username or password. Please check your credentials or register.');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser'); // Remove current user details from localStorage
    setCurrentUser(null); // Clear current user context
    navigate('/'); // Navigate to login or home page
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <h2 style={{ textAlign: 'center' }}>LOGIN</h2>
        <div className="login-form">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
          <p>New User? <Link to="/register">Register</Link></p>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;

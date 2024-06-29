import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Import CSS for styling

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username.trim() === '' || password.trim() === '') {
      setError('Username and password cannot be empty.');
      return;
    }

    const adminUser = { username: 'admin', password: 'admin12', role: 'admin' };
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    console.log('Entered Username:', username);
    console.log('Entered Password:', password);
    console.log('Stored Registered Users:', registeredUsers);

    const user = registeredUsers.find(u => u.username === username && u.password === password);

    if (username === adminUser.username && password === adminUser.password) {
      console.log('Logging in as Admin...');
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      onLogin(); // Notify App component of successful login
      navigate('/admin-welcome');
    } else if (user) {
      console.log('Logging in as User...');
      localStorage.setItem('currentUser', JSON.stringify(user)); // Store current user
      onLogin(); // Notify App component of successful login
      navigate('/user-welcome');
    } else {
      console.log('Invalid credentials. Please check your username and password.');
      setError('Invalid username or password. Please register first.'); // Error message for unregistered users
    }
  };

  const handleRegister = () => {
    navigate('/register'); // Navigate to the registration page
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

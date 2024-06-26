import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Import CSS for styling

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    // Validate inputs
    if (!username || !password || !confirmPassword || !email) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Check if username is already taken in local storage
    if (isUsernameTaken(username)) {
      setError('Username is already taken');
      return;
    }

    // Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      return;
    }

    // Store user data in local storage
    const newUser = { username, password, email };
    const registeredUsers = getRegisteredUsers();
    localStorage.setItem('registeredUsers', JSON.stringify([...registeredUsers, newUser]));

    // Optionally pass user data to onRegister function in App component
    onRegister(newUser);

    // Navigate to desired page after registration
    navigate('/'); // Redirect to login page or wherever appropriate
  };

  // Function to check if username is already taken from local storage
  const isUsernameTaken = (username) => {
    const registeredUsers = getRegisteredUsers();
    return registeredUsers.some(user => user.username === username);
  };

  // Function to get all registered users from local storage
  const getRegisteredUsers = () => {
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    return users;
  };

  return (
    <div className="register-container">
      <h2 style={{ textAlign: 'center' }}>REGISTER</h2>
      <div className="register-form">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button onClick={handleRegister}>Register</button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Register;

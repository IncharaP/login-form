import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Register.module.css';

const Register = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    if (email.trim() === '' || username.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const existingUser = registeredUsers.find(user => user.username === username);

    if (existingUser) {
      setError('Username already exists.');
      return;
    }

    const newUser = { email, username, password, role: 'user' };
    onRegister(newUser); // Pass user data to onRegister

    // Navigate to login page after successful registration
    navigate('/');

    // Alternatively, you can navigate directly to the login page:
    // navigate('/login');
  };

  return (
    <div className={styles.registerBackground}>
      <div className={styles.registerContainer}>
        <h2>Register</h2>
        <div className={styles.registerForm}>
          <label>
            Email:
            <input className={styles.inputField} type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Username:
            <input className={styles.inputField} type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label>
            Password:
            <input className={styles.inputField} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <label>
            Confirm Password:
            <input className={styles.inputField} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </label>
          {error && <p className={styles.error}>{error}</p>}
          <button onClick={handleRegister}>Register</button>
          <p>Already have an account? <Link to="/">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;

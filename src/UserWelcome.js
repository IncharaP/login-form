// UserWelcome.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from './UserContext'; // Import useUser hook
import styles from './UserWelcome.module.css';

const UserWelcome = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser(); // Get currentUser from context

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  return (
    <div className={styles.userWelcomeContainer}>
      <header className={styles.header}>
        <nav className={styles.navbar}>
          <ul className={styles.navLinks}>
            <li><Link to="/user-welcome" className={styles.navLink}>Home</Link></li>
            <li><Link to="/view-items" className={styles.navLink}>View Items</Link></li>
            <li><Link to="/user-orders" className={styles.navLink}>Orders</Link></li>
            <li><button className={styles.logoutButton} onClick={handleLogout}>Logout</button></li>
          </ul>
        </nav>
      </header>
      <div className={styles.content}>
        <h1 className={styles.welcomeMessage}>Welcome,  {currentUser ? currentUser.username : 'User'}!</h1>
        <p></p>
      </div>
    </div>
  );
};

export default UserWelcome;
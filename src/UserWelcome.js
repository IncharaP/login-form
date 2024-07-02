import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './UserWelcome.module.css'; // Import CSS file for styling

const UserWelcome = ({ username }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentSession'); // Clear current session info from local storage
    navigate('/'); // Navigate back to the login page after logout
  };

  return (
    <div className={styles.userWelcomeContainer}>
      <header className={styles.header}>
        <nav className={styles.navbar}>
          <ul className={styles.navLinks}>
            <li><Link to="/user-welcome" className={styles.navLink}>Home</Link></li>
            <li><Link to="/view-items" className={styles.navLink}>View Items</Link></li>
            <li><button className={styles.logoutButton} onClick={handleLogout}>Logout</button></li>
          </ul>
        </nav>
      </header>
      <div className={styles.content}>
        <h1 className={styles.welcomeMessage}>Welcome, {username}!</h1>
        {/* Additional content can be added here */}
      </div>
    </div>
  );
};

export default UserWelcome;

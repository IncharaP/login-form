import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AdminWelcome.module.css'; // Import CSS file for styling

const AdminWelcome = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentSession'); // Remove only the session information
    navigate('/');
  };

  return (
    <div className={styles.adminWelcomeContainer}>
      <header className={styles.header}>
        <nav className={styles.navbar}>
          <ul className={styles.navLinks}>
            <li><Link to="/admin-welcome" className={styles.navLink}>Home</Link></li>
            <li><Link to="/add-item" className={styles.navLink}>Add Item</Link></li>
            <li><Link to="/view-item-admin" className={styles.navLink}>View Items</Link></li>
            <li><Link to="/view-users" className={styles.navLink}>View Users</Link></li>
          </ul>
          <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
        </nav>
      </header>
      <div className={styles.content}>
        <h1>Welcome, Admin!</h1>
        {/* Add more content as needed */}
      </div>
    </div>
  );
};

export default AdminWelcome;

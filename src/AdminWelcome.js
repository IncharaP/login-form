import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AdminWelcome.module.css';

const AdminWelcome = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentSession');
    localStorage.removeItem('currentUser');
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
            <li><Link to="/view-orders" className={styles.navLink}>View Orders</Link></li>
            <li><Link to="/view-users" className={styles.navLink}>View Users</Link></li>
          </ul>
          <li><button className={styles.logoutButton} onClick={handleLogout}>Logout</button></li>
        </nav>
      </header>
      <div className={styles.content}>
        <h1>Welcome, Admin!</h1>
        <p>This is the admin dashboard. You can manage items and users here.</p>
      </div>
    </div>
  );
};

export default AdminWelcome;

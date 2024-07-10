import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AdminWelcome.module.css';

const AdminWelcome = () => {
  const navigate = useNavigate();
  const [registeredUsersCount, setRegisteredUsersCount] = useState(0);
  const [totalOrderedProducts, setTotalOrderedProducts] = useState(0);

  useEffect(() => {
    // Function to increment counts up to the actual stored count
    const incrementCounts = (storedCount, setterFunction) => {
      let count = 0;
      const interval = setInterval(() => {
        count++;
        setterFunction(prevCount => {
          if (prevCount >= storedCount) {
            clearInterval(interval);
            return storedCount;
          }
          return prevCount + 1;
        });
      }, 100); // Adjust interval as needed for smooth animation
      
      // Clear interval on component unmount
      return () => clearInterval(interval);
    };

    // Fetch registered users count from localStorage or your API
    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const initialRegisteredUsersCount = storedUsers.length;
    incrementCounts(initialRegisteredUsersCount, setRegisteredUsersCount);

    // Fetch total ordered products count from localStorage and increment
    const initialTotalOrderedProducts = parseInt(localStorage.getItem('totalOrderedProducts')) || 0;
    incrementCounts(initialTotalOrderedProducts, setTotalOrderedProducts);
    
    // Listen for changes in total ordered products
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleStorageChange = (event) => {
    if (event.key === 'totalOrderedProducts') {
      const updatedTotalOrderedProducts = parseInt(event.newValue) || 0;
      setTotalOrderedProducts(updatedTotalOrderedProducts);
    }
  };

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
        <div className={styles.container}>
          <h1>Welcome, Admin!</h1>
          <p>This is the admin dashboard. You can manage items and users here.</p>
          <div className={styles.countsContainer}>
            <div className={styles.countItem}>
              <h3>Registered Users</h3>
              <p>{registeredUsersCount}</p>
            </div>
            <div className={styles.countItem}>
              <h3>Total Ordered Products</h3>
              <p>{totalOrderedProducts}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWelcome;

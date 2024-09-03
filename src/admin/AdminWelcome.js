import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AdminWelcome.module.css';

const AdminWelcome = () => {
  const navigate = useNavigate();
  const [registeredUsersCount, setRegisteredUsersCount] = useState(0);
  const [totalOrderedProducts, setTotalOrderedProducts] = useState(0);
  const [displayedTotalOrders, setDisplayedTotalOrders] = useState(0);

  useEffect(() => {
    // Function to increment counts up to the actual stored count
    const incrementCounts = (storedCount, setterFunction) => {
      let count = 0;
      const interval = setInterval(() => {
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

    // Fetch registered users count from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const initialRegisteredUsersCount = storedUsers.length;
    incrementCounts(initialRegisteredUsersCount, setRegisteredUsersCount);

    // Calculate the total number of ordered products
    const calculateTotalOrderedProducts = () => {
      const orders = JSON.parse(localStorage.getItem('orders')) || [];
      let total = 0;
      orders.forEach(order => {
        order.items.forEach(item => {
          total += item.quantity;
        });
      });
      return total;
    };

    // Get the actual total ordered products count
    const actualTotalOrderedProducts = calculateTotalOrderedProducts();
    setTotalOrderedProducts(actualTotalOrderedProducts);

    // Animate the displayed total orders count
    incrementCounts(actualTotalOrderedProducts, setDisplayedTotalOrders);

  }, []);

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
              <p>{displayedTotalOrders}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWelcome;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ViewOrders.module.css';

const ViewOrders = () => {
  const [ordersList, setOrdersList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrdersList(storedOrders);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentSession');
    localStorage.removeItem('adminSession');
    navigate('/');
  };

  return (
    <div className={styles.viewOrdersPage}>
      <header className={styles.header}>
        <nav className={styles.navbar}>
          <ul className={styles.navLinks}>
            <li><Link to="/admin-welcome" className={styles.navLink}>Home</Link></li>
            <li><Link to="/add-item" className={styles.navLink}>Add Item</Link></li>
            <li><Link to="/view-item-admin" className={styles.navLink}>View Items</Link></li>
            <li><Link to="/view-orders" className={styles.navLink}>View Orders</Link></li>
            <li><Link to="/view-users" className={styles.navLink}>View Users</Link></li>
            <li><button className={styles.logoutButton} onClick={handleLogout}>Logout</button></li>
          </ul>
        </nav>
      </header>
      <div className={styles.ordersContainer}>
        <h2>Orders List</h2>
        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {ordersList.length > 0 ? (
              ordersList.map((order, index) => (
                <tr key={index}>
                  <td>{order.name}</td>
                  <td>${order.price}</td>
                  <td>{order.quantity}</td>
                  <td>{order.username}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewOrders;

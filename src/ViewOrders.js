import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OrdersContext from './OrdersContext';
import styles from './ViewOrders.module.css';

const ViewOrders = () => {
  const { ordersList, totalOrderedProducts } = useContext(OrdersContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentSession');
    localStorage.removeItem('adminSession');
    navigate('/');
  };

  useEffect(() => {
    // Optionally, you can add code here to fetch updates from an API or perform any other side effects
    // that might affect the ordersList or totalOrderedProducts.
  }, [ordersList, totalOrderedProducts]); // Listen for changes in ordersList or totalOrderedProducts

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
              <th>Serial No</th>
              <th>Username</th>
              <th>Item Name</th>
              <th>Price</th>
              <th>Quantity</th> 
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {ordersList.length > 0 ? (
              ordersList.map((order, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{order.username}</td>
                  <td>{order.name}</td>
                  <td>${order.price}</td>
                  <td>{order.quantity}</td>
                  <td><img src={order.image} alt={order.name} className={styles.orderItemImage} /></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
        {ordersList.length > 0 && (
          <div className={styles.totalProducts}>
            Total ordered products: {totalOrderedProducts}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewOrders;

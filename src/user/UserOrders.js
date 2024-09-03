import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './UserOrders.module.css';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Load orders from localStorage
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(storedOrders);
  }, []);

  const formatStatus = (status) => {
    switch(status) {
      case 'pending':
        return 'Pending';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  const handleDeleteOrder = (index) => {
    const orderToDelete = orders[index];
    const itemIdToUpdate = orderToDelete.items[0].id;
  
    // Update the stock of the item in localStorage
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];
    const updatedItems = storedItems.map(item => {
      if (item.id === itemIdToUpdate) {
        return {
          ...item,
          stock: item.stock + orderToDelete.items[0].quantity
        };
      }
      return item;
    });
  
    localStorage.setItem('items', JSON.stringify(updatedItems));
  
    // Remove the order from the list
    const updatedOrders = orders.filter((_, i) => i !== index);
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };
  

  // Calculate the total price for each item
  const calculateTotalPrice = (price, quantity) => {
    return price * quantity;
  };

  // Calculate the total price of all orders
  const calculateTotalPriceOfAllOrders = () => {
    return orders.reduce((total, order) => total + calculateTotalPrice(order.items[0].price, order.items[0].quantity), 0);
  };

  return (
    <div className={styles.ordersPage}>
      <header className={styles.header}>
        <nav className={styles.navbar}>
          <ul className={styles.navLinks}>
            <li><Link to="/user-welcome" className={styles.navLink}>Home</Link></li>
            <li><Link to="/view-items" className={styles.navLink}>View Items</Link></li>
            <li><Link to="/cart" className={styles.navLink}>Cart</Link></li>
            <li><Link to="/user-orders" className={styles.navLink}>My Orders</Link></li>
            <li><button className={styles.logoutButton} onClick={() => { localStorage.removeItem('currentSession'); localStorage.removeItem('currentUser'); window.location.reload(); }}>Logout</button></li>
          </ul>
        </nav>
      </header>
      <h2>My Orders</h2>
      {orders.length > 0 ? (
        <div className={styles.ordersTableContainer}>
          <table className={styles.ordersTable}>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Price (Total)</th> {/* Updated column header */}
                <th>Quantity</th>
                <th>Image</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>{order.items[0].name}</td>
                  <td>₹{calculateTotalPrice(order.items[0].price, order.items[0].quantity)}</td> {/* Display Total Price */}
                  <td>{order.items[0].quantity}</td>
                  <td><img src={order.items[0].image} alt={order.items[0].name} className={styles.orderImage} /></td>
                  <td>{formatStatus(order.status || 'pending')}</td>
                  <td>
                    <button 
                      onClick={() => handleDeleteOrder(index)} 
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No orders found</p>
      )}
      
      <div className={styles.totalPriceContainer}>
        <h3>Total Price of All Orders: ₹{calculateTotalPriceOfAllOrders()}</h3>
      </div>
    </div>
  );
};

export default UserOrders;

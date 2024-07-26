import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './UserOrders.module.css';

const UserOrders = () => {
  const [ordersList, setOrdersList] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = allOrders.filter(order => order.username === currentUser.username);
    setOrdersList(userOrders);

    const total = userOrders.reduce((acc, order) => acc + (order.price * order.quantity), 0);
    setTotalAmount(total);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentSession');
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const handleDelete = (order) => {
    // Update ordersList state
    const updatedOrders = ordersList.filter(o => o.id !== order.id);
    setOrdersList(updatedOrders);

    // Update orders in localStorage
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const newAllOrders = allOrders.filter(o => o.id !== order.id);
    localStorage.setItem('orders', JSON.stringify(newAllOrders));

    // Update total amount
    const total = updatedOrders.reduce((acc, o) => acc + (o.price * o.quantity), 0);
    setTotalAmount(total);

    // Update product stock in localStorage
    const allItems = JSON.parse(localStorage.getItem('items')) || [];
    const updatedItems = allItems.map(item => {
      if (item.name === order.name) {
        item.stock += order.quantity; // Increment stock
      }
      return item;
    });
    localStorage.setItem('items', JSON.stringify(updatedItems));
  };

  const handleRemove = (orderIdToRemove) => {
    // Find the order to remove from ordersList
    const orderIndex = ordersList.findIndex(order => order.id === orderIdToRemove);
    if (orderIndex === -1) {
      return; // Exit if order is not found
    }
  
    // Update ordersList state to remove the specific order
    const updatedOrders = [...ordersList];
    const removedOrder = updatedOrders.splice(orderIndex, 1)[0];
    setOrdersList(updatedOrders);
  
    // Update orders in localStorage
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const newAllOrders = allOrders.filter(order => order.id !== orderIdToRemove);
    localStorage.setItem('orders', JSON.stringify(newAllOrders));
  
    // Update total amount
    const total = updatedOrders.reduce((acc, order) => acc + (order.price * order.quantity), 0);
    setTotalAmount(total);
  
    // Update product stock in localStorage only if the order was originally added to stock
    if (removedOrder.status !== 'Delivered' && removedOrder.stockAdded) {
      const allItems = JSON.parse(localStorage.getItem('items')) || [];
      const updatedItems = allItems.map(item => {
        if (item.name === removedOrder.name) {
          item.stock += removedOrder.quantity; // Increment stock
        }
        return item;
      });
      localStorage.setItem('items', JSON.stringify(updatedItems));
    }
  };
  
  
  return (
    <div className={styles.userOrdersPage}>
      <header className={styles.header}>
        <nav className={styles.navbar}>
          <ul className={styles.navLinks}>
            <li><Link to="/user-welcome" className={styles.navLink}>Home</Link></li>
            <li><Link to="/view-items" className={styles.navLink}>View Items</Link></li>
            <li><Link to="/user-orders" className={styles.navLink}>My Orders</Link></li>
            <li><button className={styles.logoutButton} onClick={handleLogout}>Logout</button></li>
          </ul>
        </nav>
      </header>
      <div className={styles.ordersContainer}>
        <h2>Your Orders</h2>
        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Image</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {ordersList.length > 0 ? (
              ordersList.map((order, index) => (
                <tr key={order.id}>
                  <td>{order.name}</td>
                  <td>${order.price}</td>
                  <td>{order.quantity}</td>
                  <td><img src={order.image} alt={order.name} className={styles.orderItemImage} /></td>
                  <td>{order.status || 'Order Placed'}</td>
                  <td>
                    {order.status === 'Delivered' ? (
                      <button className={styles.removeButton} onClick={() => handleRemove(order.id)}>Remove</button>
                    ) : (
                      <button className={styles.deleteButton} onClick={() => handleDelete(order)}>Delete</button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className={styles.totalAmount}>
          <h3>Total Amount: ${totalAmount.toFixed(2)}</h3>
        </div>
      </div>
    </div>
  );
};

export default UserOrders;

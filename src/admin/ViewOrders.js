import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaCheck, FaTimes, FaStar } from 'react-icons/fa';
import OrdersContext from '../context/OrdersContext';
import styles from './ViewOrders.module.css';

const ViewOrders = () => {
  const { ordersList, updateOrderStatus } = useContext(OrdersContext);
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewingFeedback, setViewingFeedback] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('currentSession');
    localStorage.removeItem('adminSession');
    navigate('/');
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setViewingFeedback(false);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  const handleAccept = (index) => {
    updateOrderStatus(index, 'Delivered');
  };

  const handleReject = (index) => {
    updateOrderStatus(index, 'Rejected');
  };

  const handleViewFeedback = (order) => {
    setSelectedOrder(order);
    setViewingFeedback(true);
  };

  // Calculate the total price for an order
  const calculateTotalPrice = (price, quantity) => {
    return price * quantity;
  };

  // Calculate total ordered products
  const totalOrderedProducts = ordersList.reduce((total, order) => {
    return total + (order.items[0]?.quantity || 0);
  }, 0);

  return (
    <div className={styles.ordersPage}>
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
      <h2>Orders List</h2>
      {ordersList.length > 0 ? (
        <div className={styles.ordersTableContainer}>
          <table className={styles.ordersTable}>
            <thead>
              <tr>
                <th>Serial No</th>
                <th>Username</th>
                <th>Item Name</th>
                <th>Price (Total)</th>
                <th>Quantity</th>
                <th>Image</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ordersList.map((order, index) => (
                <tr key={order.id}>
                  <td>{index + 1}</td>
                  <td>{order.username}</td>
                  <td>{order.items[0]?.name || 'N/A'}</td>
                  <td>₹{calculateTotalPrice(order.items[0]?.price || 0, order.items[0]?.quantity || 0)}</td>
                  <td>{order.items[0]?.quantity || 'N/A'}</td>
                  <td>
                    <img 
                      src={order.items[0]?.image || '/path/to/default/image.jpg'} 
                      alt={order.items[0]?.name || 'No Image'} 
                      className={styles.orderItemImage} 
                    />
                  </td>
                  <td>{order.status || 'Pending'}</td>
                  <td>
                    <button onClick={() => handleViewDetails(order)}>
                      <FaEye />
                    </button>
                    {order.status !== 'Delivered' && (
                      <>
                        <button onClick={() => handleAccept(index)}>
                          <FaCheck />
                        </button>
                        <button onClick={() => handleReject(index)}>
                          <FaTimes />
                        </button>
                      </>
                    )}
                    {order.feedback && (
                      <button onClick={() => handleViewFeedback(order)}>
                        View Feedback
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No orders found</p>
      )}
      {selectedOrder && (
        <div className={styles.orderDetailsModal}>
          <div className={styles.orderDetailsContent}>
            <h3>{viewingFeedback ? 'Feedback Details' : 'Order Details'}</h3>
            {viewingFeedback ? (
              <div className={styles.feedbackSection}>
                <p><strong>Feedback:</strong> {selectedOrder.feedback}</p>
                <p><strong>Rating:</strong> {selectedOrder.rating} <FaStar /></p>
                <button onClick={() => setViewingFeedback(false)}>Back to Details</button>
              </div>
            ) : (
              <>
                <p><strong>Username:</strong> {selectedOrder.username}</p>
                <p><strong>Item Name:</strong> {selectedOrder.items[0]?.name || 'N/A'}</p>
                <p><strong>Price:</strong> ₹{calculateTotalPrice(selectedOrder.items[0]?.price || 0, selectedOrder.items[0]?.quantity || 0)}</p>
                <p><strong>Quantity:</strong> {selectedOrder.items[0]?.quantity || 'N/A'}</p>
                <p><strong>User's Address:</strong> {selectedOrder.userDetails?.address || 'N/A'}</p>
                <p><strong>Phone Number:</strong> {selectedOrder.userDetails?.phoneNumber || 'N/A'}</p>
                <p><strong>Pincode:</strong> {selectedOrder.userDetails?.pincode || 'N/A'}</p>
                <p><strong>Payment Method:</strong> {selectedOrder.userDetails?.paymentMethod || 'N/A'}</p>
                {selectedOrder.feedback && (
                  <button onClick={() => handleViewFeedback(selectedOrder)}>View Feedback</button>
                )}
              </>
            )}
            <button onClick={handleCloseDetails}>Close</button>
          </div>
        </div>
      )}
      {ordersList.length > 0 && (
        <div className={styles.totalProducts}>
          Total ordered products: {totalOrderedProducts}
        </div>
      )}
    </div>
  );
};

export default ViewOrders;

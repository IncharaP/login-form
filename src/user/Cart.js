import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Cart.module.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load cart items from localStorage
    const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCartItems);
  }, []);

  const handleRemoveItem = (itemId) => {
    const updatedCartItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCartItems);
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));
  };

  const handleBuyNow = (item) => {
    setSelectedProduct(item);
    setQuantity(item.quantity || 1); // Set the initial quantity to the item's quantity
    setShowBuyNowModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentSession');
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const handleOrder = () => {
    if (!validateUserDetails()) {
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser || !currentUser.username) {
      alert('User information not found. Please log in again.');
      navigate('/');
      return;
    }

    const order = {
      items: [{
        ...selectedProduct,
        quantity: quantity,
      }],
      userDetails: {
        name: currentUser.username,
        phoneNumber,
        address,
        pincode,
        paymentMethod
      },
      username: currentUser.username,
      status: 'pending' // Add status to the order
    };

    // Save the order
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    storedOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(storedOrders));

    // Update the cart item quantity
    const updatedCartItems = cartItems.map(item => {
      if (item.id === selectedProduct.id) {
        // Update quantity
        const newQuantity = item.quantity - quantity;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(item => item !== null); // Remove items with zero quantity

    setCartItems(updatedCartItems);
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));

    const storedItems = JSON.parse(localStorage.getItem('items')) || [];
  const updatedItems = storedItems.map(item => {
    if (item.id === selectedProduct.id) {
      return {
        ...item,
        stock: Math.max(0, item.stock - quantity) // Decrease stock
      };
    }
    return item;
  });
  localStorage.setItem('items', JSON.stringify(updatedItems));

    setNotification('Your order has been placed successfully!');
    setShowBuyNowModal(false);
    navigate('/user-orders'); // Redirect to the "My Orders" page
  };

  const validateUserDetails = () => {
    if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
      alert('Please enter a valid 10-digit phone number.');
      return false;
    }

    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      alert('Please enter a valid 6-digit pincode.');
      return false;
    }

    if (address.trim() === '') {
      alert('Please enter your address.');
      return false;
    }

    return true;
  };

  const clearNotification = () => {
    setNotification(null);
  };

  const increaseQuantity = () => {
    if (selectedProduct && quantity < selectedProduct.quantity) {
      setQuantity(prev => prev + 1); // Increase but do not exceed available quantity
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1); // Decrease but do not go below 1
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 2000); // Clear notification after 2 seconds

      return () => clearTimeout(timer); // Clean up the timer if component unmounts
    }
  }, [notification]);

  return (
    <div className={styles.cartPage}>
      <header className={styles.header}>
        <nav className={styles.navbar}>
          <ul className={styles.navLinks}>
            <li><Link to="/user-welcome" className={styles.navLink}>Home</Link></li>
            <li><Link to="/view-items" className={styles.navLink}>View Items</Link></li>
            <li><Link to="/cart" className={styles.navLink}>Cart</Link></li>
            <li><Link to="/user-orders" className={styles.navLink}>My Orders</Link></li>
            <li><button className={styles.logoutButton} onClick={handleLogout}>Logout</button></li>
          </ul>
        </nav>
      </header>
      <h2>Shopping Cart</h2>
      <div className={styles.cartItemsContainer}>
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <div key={index} className={styles.cartItemBox}>
              <img src={item.image} alt={item.name} className={styles.cartItemImage} />
              <div className={styles.cartItemDetails}>
                <h3>{item.name}</h3>
                <p>Price: ₹{item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <div className={styles.buttonGroup}>
                  <button onClick={() => handleRemoveItem(item.id)} className={styles.removeButton}>Remove</button>
                  <button onClick={() => handleBuyNow(item)} className={styles.buyNowButton}>Buy Now</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No items in the cart</p>
        )}
      </div>

      {showBuyNowModal && selectedProduct && (
        <div className={styles.orderModal}>
          <div className={styles.orderModalContent}>
            <h3>Buy Now</h3>
            <p>Product: {selectedProduct.name}</p>
            <p>Price: ₹{selectedProduct.price}</p>
            <p>Username: {JSON.parse(localStorage.getItem('currentUser')).username}</p>
            {selectedProduct.quantity > 1 && (
              <label>
                Quantity:
                <div className={styles.quantityControls}>
                  <button onClick={decreaseQuantity} className={styles.quantityButton}>-</button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                  />
                  <button onClick={increaseQuantity} className={styles.quantityButton}>+</button>
                </div>
              </label>
            )}
            <label>
              Phone Number:
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => {
                  const input = e.target.value.replace(/\D/g, '');
                  const truncatedInput = input.slice(0, 10);
                  setPhoneNumber(truncatedInput);
                }}
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </label>
            <label>
              Pincode:
              <input
                type="text"
                value={pincode}
                onChange={(e) => {
                  const input = e.target.value.replace(/\D/g, '');
                  const truncatedInput = input.slice(0, 6);
                  setPincode(truncatedInput);
                }}
              />
            </label>
            <label>
              Payment Method:
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="cod">COD (Cash on Delivery)</option>
                {/* Add more payment methods if needed */}
              </select>
            </label>
            <button onClick={handleOrder} className={styles.confirmButton}>Confirm Order</button>
            <button onClick={() => setShowBuyNowModal(false)} className={styles.cancelButton}>Cancel</button>
          </div>
        </div>
      )}

      {notification && (
        <div className={styles.notification}>
          <p>{notification}</p>
          <button onClick={clearNotification}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Cart;

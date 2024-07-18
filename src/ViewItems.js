import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ViewItem.module.css';

const ViewItem = () => {
  const [itemsList, setItemsList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // default to cod
  const [upiId, setUpiId] = useState('');
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  // Load items from localStorage on initial render and when items change
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];
    setItemsList(storedItems);
  }, []);

  // Listen for changes in localStorage from the ViewItemAdmin component
  useEffect(() => {
    const handleStorageChange = () => {
      const storedItems = JSON.parse(localStorage.getItem('items')) || [];
      setItemsList(storedItems);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const handleOrder = (item) => {
    setSelectedItem(item);
  };

  const handleConfirmOrder = () => {
    if (!selectedItem || quantity <= 0) {
      alert('Please select an item and enter a valid quantity.');
      return;
    }

    const orderQuantity = Number(quantity);
    const availableStock = itemsList.find((item) => item.id === selectedItem.id)?.stock || 0;

    if (orderQuantity > availableStock) {
      alert(`Cannot order ${orderQuantity} items. Only ${availableStock} items available.`);
      return;
    }

    // Validate user details
    if (!validateUserDetails()) {
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser || !currentUser.username) {
      alert('User information not found. Please log in again.');
      navigate('/');
      return;
    }

    const updatedItems = itemsList.map((item) => {
      if (item.id === selectedItem.id) {
        const updatedItem = {
          ...item,
          stock: item.stock - orderQuantity
        };
        return updatedItem;
      }
      return item;
    });

    localStorage.setItem('items', JSON.stringify(updatedItems));

    const order = {
      ...selectedItem,
      quantity: orderQuantity,
      username: currentUser.username,
      userDetails: {
        name,
        phoneNumber,
        address,
        pincode,
        paymentMethod,
        upiId: paymentMethod === 'upi' ? upiId : ''  // Include UPI ID only if payment method is UPI
      }
    };

    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    storedOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(storedOrders));

    // Construct success message with order details
  const orderDetails = `Your order for ${orderQuantity} unit(s) of ${selectedItem.name} for $${orderQuantity * selectedItem.price} has been successfully placed.`;

  // Display success message with order details and thank you message
  setNotification(`${orderDetails} \nThank you for your order, ${currentUser.username} `);

  
    setSelectedItem(null);
    setQuantity(1);
    setName('');
    setPhoneNumber('');
    setAddress('');
    setPincode('');
    setPaymentMethod('cod'); // Reset payment method to cod
    setUpiId('');
    setItemsList(updatedItems); // Update local state to reflect new item stock
  };

  const validateUserDetails = () => {
    if (quantity < 1) {
      alert('Please enter a valid quantity (minimum 1).');
      return false;
    }

    if (name.trim() === '' || phoneNumber.trim() === '' || address.trim() === '' || pincode.trim() === '') {
      alert('Please fill out all fields.');
      return false;
    }

    if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
      alert('Please enter a valid 10-digit phone number.');
      return false;
    }

    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      alert('Please enter a valid 6-digit pincode.');
      return false;
    }

    if (paymentMethod === 'upi' && !validateUPI()) {
      return false;
    }

    return true;
  };

  const validateUPI = () => {
    // Implement your UPI validation logic here (example: check for valid format)
    // Example validation: Ensure UPI ID is a valid format
    // For simplicity, this is a basic format check
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(upiId)) {
      alert('Please enter a valid UPI ID.');
      return false;
    }
    return true;
  };


  const clearNotification = () => {
    setNotification(null);
  };

  return (
    <div className={styles.viewItemPage}>
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
      <h2>View Items</h2>
      <div className={styles.itemsContainer}>
        {itemsList.length > 0 ? (
          itemsList.map((item, index) => (
            <div key={index} className={styles.itemBox}>
              <img src={item.image} alt={item.name} className={styles.itemImage} />
              <div className={styles.itemDetails}>
                <h3>Title: {item.name}</h3>
                <p>Price: ${item.price}</p>
                <p>Description: {item.description}</p>
                {item.stock > 0 ? (
                  <React.Fragment>
                    <button onClick={() => handleOrder(item)}>Order</button>
                  </React.Fragment>
                ) : (
                  <p className={styles.outOfStock}>Out of Stock</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No items found</p>
        )}
      </div>

      {selectedItem && (
        <div className={styles.orderModal}>
          <div className={styles.orderModalContent}>
            <h3>Order {selectedItem.name}</h3>
            <p>Price: ${selectedItem.price}</p>
            <label>
              Quantity:
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                max={selectedItem.stock} // Limit input to available stock
              />
            </label>
            <label>
              Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              Phone Number:
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => {
                  // Ensure only digits are entered
                  const input = e.target.value.replace(/\D/g, '');
                  // Limit input to 10 characters
                  const truncatedInput = input.slice(0, 10);
                  // Update state
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
                  // Ensure only digits are entered
                  const input = e.target.value.replace(/\D/g, '');
                  // Limit input to 6 characters
                  const truncatedInput = input.slice(0, 6);
                  // Update state
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
                <option value="upi">UPI (Unified Payments Interface)</option>
              </select>
            </label>
            {paymentMethod === 'upi' && (
              <label>
                UPI ID:
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </label>
            )}
            <button onClick={handleConfirmOrder}>Confirm Order</button>
            <button onClick={() => setSelectedItem(null)}>Cancel</button>
          </div>
        </div>
      )}

       {/* Notification or alert message */}
       {notification && (
        <div className={styles.notification}>
          <p>{notification}</p>
          <button onClick={clearNotification}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ViewItem;

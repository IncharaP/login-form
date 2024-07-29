import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import styles from './ViewItem.module.css';

const ViewItem = () => {
  const [itemsList, setItemsList] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [upiId, setUpiId] = useState('');
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];
    setItemsList(storedItems);
    setFilteredItems(storedItems);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedItems = JSON.parse(localStorage.getItem('items')) || [];
      setItemsList(storedItems);
      setFilteredItems(storedItems);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSearch = () => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const results = itemsList.filter(item =>
      item.name.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredItems(results);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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
        return {
          ...item,
          stock: item.stock - orderQuantity
        };
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
        upiId: paymentMethod === 'upi' ? upiId : ''
      }
    };

    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    storedOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(storedOrders));

    const orderDetails = `Your order for ${orderQuantity} unit(s) of ${selectedItem.name} for $${orderQuantity * selectedItem.price} has been successfully placed.`;
    setNotification(`${orderDetails} \nThank you for your order, ${currentUser.username}`);

    setSelectedItem(null);
    setQuantity(1);
    setName('');
    setPhoneNumber('');
    setAddress('');
    setPincode('');
    setPaymentMethod('cod');
    setUpiId('');
    setItemsList(updatedItems);
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
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(upiId)) {
      alert('Please enter a valid UPI ID.');
      return false;
    }
    return true;
  };

  const clearNotification = () => {
    setNotification(null);
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
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSearch} className={styles.searchButton}>
          <FaSearch />
        </button>
      </div>
      <div className={styles.itemsContainer}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <div key={index} className={styles.itemBox}>
              <img src={item.image} alt={item.name} className={styles.itemImage} />
              <div className={styles.itemDetails}>
                <h3>{item.name}</h3>
                <p>Price: ${item.price}</p>
                <p>{item.description}</p>
                {item.stock > 0 ? (
                  <button onClick={() => handleOrder(item)}>Order</button>
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
            <p>Price: {selectedItem.price}</p>
            <label>
              Quantity:
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                max={selectedItem.stock}
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

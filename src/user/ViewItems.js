// src/pages/ViewItem.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import styles from './ViewItem.module.css';

const ViewItem = () => {
  const [itemsList, setItemsList] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
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

  const handleAddToCart = (item) => {
    setSelectedItem(item);
  };

  const handleConfirmQuantity = () => {
    if (!selectedItem || quantity <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }

    const orderQuantity = Number(quantity);
    const availableStock = itemsList.find((item) => item.id === selectedItem.id)?.stock || 0;

    if (orderQuantity > availableStock) {
      alert(`Cannot add ${orderQuantity} items. Only ${availableStock} items available.`);
      return;
    }

  
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingCartItemIndex = storedCart.findIndex((item) => item.id === selectedItem.id);
    if (existingCartItemIndex > -1) {
      // Item exists in cart, update quantity
      const updatedCart = [...storedCart];
      updatedCart[existingCartItemIndex].quantity += orderQuantity;
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      // Item does not exist in cart, add new entry
      const cartItem = {
        ...selectedItem,
        quantity: orderQuantity
      };
      storedCart.push(cartItem);
      localStorage.setItem('cart', JSON.stringify(storedCart));
    }

    const cartDetails = `Added ${orderQuantity} unit(s) of ${selectedItem.name} to your cart.`;
    setNotification(cartDetails);

    // Update stock
    setItemsList(itemsList.map((i) =>
      i.id === selectedItem.id ? { ...i, stock: i.stock - orderQuantity } : i
    ));

    // Redirect to cart page
    navigate('/cart');

    setSelectedItem(null);
    setQuantity(1);
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
            <li><Link to="/cart" className={styles.navLink}>Cart</Link></li>
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
                <p>Price: ₹{item.price}</p>
                <p>{item.description}</p>
                {item.stock > 0 ? (
                  <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
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
        <div className={styles.quantityModal}>
          <div className={styles.quantityModalContent}>
            <h3>Enter Quantity for {selectedItem.name}</h3>
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
            <button onClick={handleConfirmQuantity}>Confirm</button>
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

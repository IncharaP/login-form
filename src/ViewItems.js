import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ViewItem.module.css';

const ViewItem = () => {
  const [itemsList, setItemsList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
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

    const order = { ...selectedItem, quantity: orderQuantity, username: currentUser.username };
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    storedOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(storedOrders));

    alert('Order placed successfully!');
    setSelectedItem(null);
    setQuantity(1);
    setItemsList(updatedItems); // Update local state to reflect new item stock
  };

  return (
    <div className={styles.viewItemPage}>
      <header className={styles.header}>
        <nav className={styles.navbar}>
          <ul className={styles.navLinks}>
            <li><Link to="/user-welcome" className={styles.navLink}>Home</Link></li>
            <li><Link to="/view-items" className={styles.navLink}>View Items</Link></li>
            <li><Link to="/user-orders" className={styles.navLink}>Orders</Link></li>
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
            <button onClick={handleConfirmOrder}>Confirm Order</button>
            <button onClick={() => setSelectedItem(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewItem;

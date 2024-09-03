import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ViewItemAdmin.module.css';

const ViewItemAdmin = () => {
  const [items, setItems] = useState([]);
  const [editItemId, setEditItemId] = useState(null);
  const [editedItem, setEditedItem] = useState({
    id: '',
    name: '',
    price: '',
    description: '',
    stock: 0, // Initialize stock as number
    image: ''
  });
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];
    setItems(storedItems);
  };

  const handleDeleteItem = (itemId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (confirmDelete) {
      const updatedItems = items.filter(item => item.id !== itemId);
      setItems(updatedItems);
      localStorage.setItem('items', JSON.stringify(updatedItems));
      setNotification('Item deleted successfully.');
    }
  };

  const handleEditItem = (item) => {
    setEditItemId(item.id);
    setEditedItem({
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      stock: item.stock || 0, // Ensure stock is a number
      image: item.image
    });
  };

  const handleSaveItem = () => {
    const updatedItems = items.map(item =>
      item.id === editedItem.id ? { ...editedItem, stock: parseInt(editedItem.stock, 10) } : item
  
    );
    setItems(updatedItems);
    localStorage.setItem('items', JSON.stringify(updatedItems));
    setEditItemId(null); // Exit edit mode
    setNotification('Item saved successfully.');
  };

  const handleCancelEdit = () => {
    setEditItemId(null); // Cancel edit mode
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedItem(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedItem(prevState => ({
          ...prevState,
          image: reader.result // Update image with base64 data
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStockChange = (increment) => {
    setEditedItem(prevState => ({
      ...prevState,
      stock: Math.max(0, parseInt(prevState.stock || 0) + increment) // Ensure stock does not go below 0
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('currentSession');
    localStorage.removeItem('currentUser');
    navigate('/'); // Navigate to the home route
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
    <div className={styles.viewItemAdminPage}>
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
      <div className={styles.itemsContainer}>
        <h2>Items List</h2>
        <table className={styles.itemsTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th>Stock</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>₹{`${item.price}`}</td>
                  <td>{item.description}</td>
                  <td>{item.stock}</td>
                  <td><img src={item.image} alt={item.name} className={styles.itemImage} /></td>
                  <td className={styles.actionButtons}>
                    <button className={styles.editButton} onClick={() => handleEditItem(item)}>Edit</button>
                    <button className={styles.deleteButton} onClick={() => handleDeleteItem(item.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No items found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editItemId !== null && (
        <div className={styles.editItemContainer}>
          <h2>Edit Item</h2>
          <form className={styles.editItemForm} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editedItem.name}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="price">Price:</label>
              <input
                type="number"
                id="price"
                name="price"
                value={editedItem.price}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={editedItem.description}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Stock:</label>
              <button type="button" onClick={() => handleStockChange(-1)}>-</button>
              <span>{editedItem.stock}</span>
              <button type="button" onClick={() => handleStockChange(1)}>+</button>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="image">Image:</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
              />
              {editedItem.image && (
                <img src={editedItem.image} alt={editedItem.name} className={styles.imagePreview} />
              )}
            </div>
            <div className={styles.formGroup}>
              <button className={styles.saveButton} type="button" onClick={handleSaveItem}>Save</button>
              <button className={styles.cancelButton} type="button" onClick={handleCancelEdit}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {notification && <div className={styles.notification}>{notification}</div>}
    </div>
  );
};

export default ViewItemAdmin;

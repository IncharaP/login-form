import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ViewItemAdmin.module.css'; // Import CSS module for styling

const ViewItemAdmin = () => {
  const [itemsList, setItemsList] = useState([]);
  const [editItemId, setEditItemId] = useState(null); // State to track which item is being edited
  const [editItemName, setEditItemName] = useState('');
  const [editItemPrice, setEditItemPrice] = useState('');
  const [showEditForm, setShowEditForm] = useState(false); // State to control display of edit form
  const navigate = useNavigate();

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];
    setItemsList(storedItems);
  }, []);

  const handleDeleteItem = (itemId) => {
    // Ask for confirmation before deleting
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (!confirmDelete) {
      return;
    }

    // Filter out the item with the given itemId
    const updatedItems = itemsList.filter(item => item.id !== itemId);
    // Update local storage and state
    localStorage.setItem('items', JSON.stringify(updatedItems));
    setItemsList(updatedItems);

    // Alert the user after deletion
    alert('Item deleted successfully.');
  };

  const handleEditItem = (item) => {
    // Set the item id and details to edit
    setEditItemId(item.id);
    setEditItemName(item.name);
    setEditItemPrice(item.price);
    setShowEditForm(true); // Show the edit form
  };

  const handleUpdateItem = () => {
    // Update the item in the list and local storage
    const updatedItems = itemsList.map(item => {
      if (item.id === editItemId) {
        return { ...item, name: editItemName, price: editItemPrice };
      }
      return item;
    });

    localStorage.setItem('items', JSON.stringify(updatedItems));
    setItemsList(updatedItems);
    // Clear the edit state after updating
    setEditItemId(null);
    setEditItemName('');
    setEditItemPrice('');
    setShowEditForm(false); // Hide the edit form after updating
  };

  const handleLogout = () => {
    // Perform logout actions if needed (e.g., clear session)
    navigate('/');
  };

  return (
    <>
      <header className={styles.navbar}>
        <nav>
          <ul className={styles.navLinks}>
            <li><Link to="/admin-welcome" className={styles.navLink}>Home</Link></li>
            <li><Link to="/add-item" className={styles.navLink}>Add Item</Link></li>
            <li><Link to="/view-item-admin" className={styles.navLink}>View Items</Link></li>
            <li><Link to="/view-users" className={styles.navLink}>View Users</Link></li>
            <li><button className={styles.logoutButton} onClick={handleLogout}>Logout</button></li>
          </ul>
        </nav>
      </header>

      <div className={styles.container}>
        <div className={styles.itemsTableContainer}>
          {itemsList.length > 0 ? (
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th>Item ID</th>
                  <th>Item Name</th>
                  <th>Item Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {itemsList.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td className={styles.editableColumn}>
                      {editItemId === item.id && showEditForm ? (
                        <input
                          type="text"
                          value={editItemName}
                          onChange={(e) => setEditItemName(e.target.value)}
                          className={styles.editInput}
                        />
                      ) : (
                        item.name
                      )}
                    </td>
                    <td className={styles.editableColumn}>
                      {editItemId === item.id && showEditForm ? (
                        <input
                          type="number"
                          value={editItemPrice}
                          onChange={(e) => setEditItemPrice(e.target.value)}
                          className={styles.editInput}
                        />
                      ) : (
                        item.price
                      )}
                    </td>
                    <td className={styles.actionColumn}>
                      {editItemId === item.id && showEditForm ? (
                        <div className={styles.actionButtons}>
                          <button className={styles.saveButton} onClick={handleUpdateItem}>Save</button>
                          <button className={styles.cancelButton} onClick={() => setShowEditForm(false)}>Cancel</button>
                        </div>
                      ) : (
                        <>
                          <span className={styles.actionLink} onClick={() => handleEditItem(item)}>Edit</span>
                          <span className={styles.actionSeparator}>|</span>
                          <span className={styles.actionLink} onClick={() => handleDeleteItem(item.id)}>Delete</span>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No items added yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewItemAdmin;

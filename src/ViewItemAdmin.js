import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ViewItemAdmin.module.css'; // Import CSS module for styling

const ViewItemAdmin = () => {
  const [itemsList, setItemsList] = useState([]);
  const [editItemId, setEditItemId] = useState(null); // State to track which item is being edited
  const [editItemName, setEditItemName] = useState('');
  const [editItemPrice, setEditItemPrice] = useState('');
  const [editItemDescription, setEditItemDescription] = useState('');
  const [editItemImage, setEditItemImage] = useState('');
  const [newItemImage, setNewItemImage] = useState(null); // State to handle newly uploaded image
  const [showEditForm, setShowEditForm] = useState(false); // State to control display of edit form
  const navigate = useNavigate();

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];
    setItemsList(storedItems);
  }, []);

  const handleDeleteItem = (itemId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (!confirmDelete) return;

    const updatedItems = itemsList.filter(item => item.id !== itemId);
    localStorage.setItem('items', JSON.stringify(updatedItems));
    setItemsList(updatedItems);

    alert('Item deleted successfully.');
  };

  const handleEditItem = (item) => {
    setEditItemId(item.id);
    setEditItemName(item.name);
    setEditItemPrice(item.price);
    setEditItemDescription(item.description);
    setEditItemImage(item.image);
    setShowEditForm(true); // Show the edit form
  };

  const handleUpdateItem = () => {
    const updatedItems = itemsList.map(item => {
      if (item.id === editItemId) {
        return { ...item, name: editItemName, price: editItemPrice, description: editItemDescription, image: editItemImage };
      }
      return item;
    });

    // Check if a new image is uploaded
    if (newItemImage) {
      const updatedItem = updatedItems.find(item => item.id === editItemId);
      updatedItem.image = URL.createObjectURL(newItemImage); // Use blob URL for newly uploaded image
    }

    localStorage.setItem('items', JSON.stringify(updatedItems));
    setItemsList(updatedItems);

    setEditItemId(null);
    setEditItemName('');
    setEditItemPrice('');
    setEditItemDescription('');
    setEditItemImage('');
    setNewItemImage(null); // Reset new image state
    setShowEditForm(false); // Hide the edit form after updating
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewItemImage(file);
      setEditItemImage(URL.createObjectURL(file)); // Use blob URL for preview
    }
  };

  const handleLogout = () => {
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
            <li><Link to="/view-orders" className={styles.navLink}>View Orders</Link></li>
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
                  <th>Item Description</th>
                  <th>Item Image</th>
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
                    <td className={styles.editableColumn}>
                      {editItemId === item.id && showEditForm ? (
                        <textarea
                          value={editItemDescription}
                          onChange={(e) => setEditItemDescription(e.target.value)}
                          className={styles.editTextarea}
                        />
                      ) : (
                        item.description
                      )}
                    </td>
                    <td className={styles.imageColumn}>
                      {editItemId === item.id && showEditForm ? (
                        <>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className={styles.imageUploadInput}
                          />
                          {newItemImage ? (
                            <img
                              src={URL.createObjectURL(newItemImage)}
                              alt="New Item Image"
                              className={styles.editImagePreview}
                            />
                          ) : (
                            <img
                              src={editItemImage}
                              alt="Item Image"
                              className={styles.editImage}
                            />
                          )}
                        </>
                      ) : (
                        <img
                          src={item.image}
                          alt="Item Image"
                          className={styles.itemImage}
                        />
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

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useItemContext } from './ItemContext'; // Import the context
import styles from './AddItem.module.css'; // Import the CSS file for styling

const AddItem = () => {
  const { addItem } = useItemContext(); // Access addItem function from context
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemImageFile, setItemImageFile] = useState(null); // State for image file
  const [message, setMessage] = useState('');
  const [itemsList, setItemsList] = useState([]);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const navigate = useNavigate();

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];
    setItemsList(storedItems);
  }, []);

  // Generate item ID starting from 1 and incrementing
  const generateItemId = () => {
    return `${itemsList.length + 1}`;
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Validate input fields
    if (!itemName || !itemPrice || !itemDescription || !itemCategory || !itemImageFile) {
      setMessage('All fields are required');
      return;
    }

    const itemId = generateItemId();

    // Convert image file to base64 string
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;

      // Add item to context
      addItem({ id: itemId, name: itemName, price: itemPrice, description: itemDescription, category: itemCategory, image: base64Image });

      // Update local storage with new item
      const updatedItems = [...itemsList, { id: itemId, name: itemName, price: itemPrice, description: itemDescription, category: itemCategory, image: base64Image }];
      localStorage.setItem('items', JSON.stringify(updatedItems));
      setItemsList(updatedItems);

      // Clear form fields after submission
      setItemName('');
      setItemPrice('');
      setItemDescription('');
      setItemCategory('');
      setItemImageFile(null);
      setImagePreview(null); // Clear image preview

      // Show message that item has been added
      setMessage('Item added successfully!');

      // Clear message after a few seconds
      setTimeout(() => {
        setMessage('');
      }, 3000); // Clear message after 3 seconds
    };
    reader.readAsDataURL(itemImageFile);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    setItemImageFile(file);

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
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
            <li><Link to="/view-orders" className={styles.navLink}>View Orders</Link></li>
            <li><Link to="/view-users" className={styles.navLink}>View Users</Link></li>
            <li><button className={styles.logoutButton} onClick={handleLogout}>Logout</button></li>
          </ul>
        </nav>
      </header>

      <div className={styles.addItemContainer}>
        <h2>Add New Product</h2>
        <form onSubmit={handleFormSubmit} className={styles.addItemForm}>
          <div className={styles.formGroup}>
            <label htmlFor="itemName">Product Name:</label>
            <input
              type="text"
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="itemPrice">Product Price:</label>
            <input
              type="number"
              id="itemPrice"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="itemDescription">Product Description:</label>
            <textarea
              id="itemDescription"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="itemCategory">Product Category:</label>
            <input
              type="text"
              id="itemCategory"
              value={itemCategory}
              onChange={(e) => setItemCategory(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="itemImageFile">Product Image:</label>
            <input
              type="file"
              id="itemImageFile"
              accept="image/*"
              onChange={handleImageFileChange}
              required
            />
          </div>
          {imagePreview && (
            <div className={styles.imagePreview}>
              <img src={imagePreview} alt="Image Preview" />
            </div>
          )}
          <button type="submit">Add Product</button>
        </form>
        {message && <p className={styles.errorMessage}>{message}</p>}
      </div>
    </>
  );
};

export default AddItem;

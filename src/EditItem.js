import React, { useState, useEffect } from 'react';
import './edit-item.css';

const EditItem = () => {
  const [itemId, setItemId] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [itemsList, setItemsList] = useState([]);

  // Function to fetch item details when itemId changes
  useEffect(() => {
    if (itemId) {
      fetchItemDetails(itemId);
    }
  }, [itemId]);

  // Fetch item details function
  const fetchItemDetails = async (itemId) => {
    setLoading(true);
    try {
      // Simulating fetch from localStorage or API endpoint
      const storedItems = JSON.parse(localStorage.getItem('items')) || [];
      const selectedItem = storedItems.find(item => item.id === itemId);

      if (selectedItem) {
        setItemName(selectedItem.name || '');
        setItemPrice(selectedItem.price ? selectedItem.price.toString() : '');
        setErrorMessage('');
      } else {
        setItemName('');
        setItemPrice('');
        setErrorMessage('Item not found');
      }
    } catch (error) {
      console.error('Failed to fetch item details:', error);
      setErrorMessage('Failed to fetch item details');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission to update item in localStorage
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const storedItems = JSON.parse(localStorage.getItem('items')) || [];
      const itemIndex = storedItems.findIndex(item => item.id === itemId);

      if (itemIndex === -1) {
        setErrorMessage('Item not found');
        return;
      }

      // Update item in localStorage
      storedItems[itemIndex] = { id: itemId, name: itemName, price: parseFloat(itemPrice) || 0 };
      localStorage.setItem('items', JSON.stringify(storedItems));

      setSuccessMessage('Item updated successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error('Failed to update item:', error);
      setErrorMessage('Failed to update item');
    }
  };

  return (
    <div className="edit-item-container">
      <h2>Edit Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="itemId">Item ID:</label>
          <input
            type="text"
            id="itemId"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="itemName">Item Name:</label>
          <input
            type="text"
            id="itemName"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="itemPrice">Item Price:</label>
          <input
            type="text"
            id="itemPrice"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            required
          />
        </div>
        <button type="submit">Update Item</button>
      </form>
      {loading && <p>Loading...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
};

export default EditItem;

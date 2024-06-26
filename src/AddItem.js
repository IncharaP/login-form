import React, { useState, useEffect } from 'react';
import { useItemContext } from './ItemContext'; // Import the context
import './AddItem.css'; // Import the CSS file for styling

const AddItem = () => {
  const { addItem } = useItemContext(); // Access addItem function from context
  const [itemId, setItemId] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [message, setMessage] = useState('');
  const [itemsList, setItemsList] = useState([]);
  const [showItemsTable, setShowItemsTable] = useState(false); // State to control table visibility

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];
    setItemsList(storedItems);
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Validate input fields
    if (!itemId || !itemName || !itemPrice) {
      setMessage('All fields are required');
      return;
    }

    // Ensure itemId is unique
    if (itemsList.some(item => item.id === itemId)) {
      setMessage('Item ID must be unique');
      return;
    }

    // Add item to context
    addItem({ id: itemId, name: itemName, price: itemPrice });

    // Update local storage with new item
    const updatedItems = [...itemsList, { id: itemId, name: itemName, price: itemPrice }];
    localStorage.setItem('items', JSON.stringify(updatedItems));
    setItemsList(updatedItems);

    // Clear form fields after submission
    setItemId('');
    setItemName('');
    setItemPrice('');

    // Show message that item has been added
    setMessage('Item added successfully!');

    // Clear message after a few seconds
    setTimeout(() => {
      setMessage('');
    }, 3000); // Clear message after 3 seconds

    // Do not immediately show the items table after adding an item
    // Table will be shown when the "View Items" button is clicked
  };

  const handleViewItems = () => {
    setShowItemsTable(!showItemsTable); // Toggle table visibility
  };

  const handleItemIdChange = (e) => {
    setItemId(e.target.value);
    // Check for uniqueness as user types
    if (itemsList.some(item => item.id === e.target.value)) {
      setMessage('Item ID must be unique');
    } else {
      setMessage('');
    }
  };

  return (
    <>
      <div className="add-item-container">
        <h2>Add New Item</h2>
        <form onSubmit={handleFormSubmit} className="add-item-form">
          <div className="form-group">
            <label htmlFor="itemId">Item ID:</label>
            <input
              type="text"
              id="itemId"
              value={itemId}
              onChange={handleItemIdChange}
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
              type="number"
              id="itemPrice"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              required
            />
          </div>
          <button type="submit">Add Item</button>
        </form>
        {message && <p className="error-message">{message}</p>}
      </div>

      <div className="view-items-container">
        <button onClick={handleViewItems} className="view-items-button">
          {showItemsTable ? 'Hide Items' : 'View Items'}
        </button>
        {showItemsTable && itemsList.length > 0 && (
          <div className="items-table-container">
           <h3 style={{ textAlign: 'center' }}>Added Items</h3>
            <table className="items-table">
              <thead>
                <tr>
                  <th>Item ID</th>
                  <th>Item Name</th>
                  <th>Item Price</th>
                </tr>
              </thead>
              <tbody>
                {itemsList.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AddItem;

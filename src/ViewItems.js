import React, { useState, useEffect } from 'react';
import './ViewItem.css'; // Import the CSS file for styling

const ViewItem = () => {
  const [itemsList, setItemsList] = useState([]);

  useEffect(() => {
    // Fetch items from your API or wherever you store them
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];
    setItemsList(storedItems);
  }, []);

  return (
    <div className="view-item-page">
      <h2>View Items</h2>
      {itemsList.length > 0 ? (
        <table>
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
      ) : (
        <p>No items found</p>
      )}
    </div>
  );
};

export default ViewItem;

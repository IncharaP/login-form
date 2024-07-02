import React, { useState, useEffect } from 'react';
import styles from './ViewItem.module.css'; 
import { Link, useNavigate } from 'react-router-dom';// Import the CSS file for styling

const ViewItem = () => {
  const [itemsList, setItemsList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch items from your API or wherever you store them
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];
    setItemsList(storedItems);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser'); // Clear current session info from local storage
    navigate('/'); // Navigate back to the login page after logout
  };

  return (
    <div className={styles.viewItemPage}>
          <header className={styles.header}>
        <nav className={styles.navbar}>
          <ul className={styles.navLinks}>
            <li><Link to="/user-welcome" className={styles.navLink}>Home</Link></li>
            <li><Link to="/view-items" className={styles.navLink}>View Items</Link></li>
            <li><button className={styles.logoutButton} onClick={handleLogout}>Logout</button></li>
          </ul>
        </nav>
      </header>
      <h2>View Items</h2>
      <div className={styles.tableContainer}>
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
    </div>
  );
};

export default ViewItem;

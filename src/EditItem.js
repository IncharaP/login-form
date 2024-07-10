import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './EditItem.module.css';

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];
    const itemToEdit = storedItems.find(item => item.id === parseInt(id));
    if (itemToEdit) {
      setItem(itemToEdit);
    } else {
      navigate('/view-item-admin');
    }
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];
    const updatedItems = storedItems.map(storedItem => (storedItem.id === item.id ? item : storedItem));
    localStorage.setItem('items', JSON.stringify(updatedItems));
    navigate('/view-item-admin');
  };

  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.editItemContainer}>
      <h2>Edit Item</h2>
      <form onSubmit={handleSubmit} className={styles.editItemForm}>
        <div className={styles.formGroup}>
          <label>Name:</label>
          <input type="text" name="name" value={item.name} onChange={handleInputChange} required />
        </div>
        <div className={styles.formGroup}>
          <label>Price:</label>
          <input type="number" name="price" value={item.price} onChange={handleInputChange} required />
        </div>
        <div className={styles.formGroup}>
          <label>Description:</label>
          <textarea name="description" value={item.description} onChange={handleInputChange} required />
        </div>
        <div className={styles.formGroup}>
          <label>Stock:</label>
          <input type="number" name="stock" value={item.stock} onChange={handleInputChange} required />
        </div>
        <div className={styles.formGroup}>
          <label>Image URL:</label>
          <input type="text" name="image" value={item.image} onChange={handleInputChange} required />
        </div>
        <button type="submit" className={styles.submitButton}>Save</button>
      </form>
    </div>
  );
};

export default EditItem;

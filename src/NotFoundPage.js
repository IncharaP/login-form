import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css'; // Import CSS Module for styling

const NotFoundPage = () => {
  return (
    <div className={styles['not-found-container']}>
      <h1 className={styles['not-found-title']}>404 Not Found</h1>
      <p className={styles['not-found-text']}>
        The page you are looking for does not exist. It may have been moved or deleted.
      </p>
      <Link to="/" className={styles['not-found-button']}>Go to Home</Link>
    </div>
  );
};

export default NotFoundPage;

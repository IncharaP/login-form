import React, { useState, useEffect } from 'react';
import styles from './ViewUsers.module.css';
import { Link, useNavigate } from 'react-router-dom';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users from local storage or API
    const fetchUsers = () => {
      const storedUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
      setUsers(storedUsers);
    };

    fetchUsers();
  }, []);

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

<div className={styles.viewUsersContainer}>

      <div className={styles.usersTableContainer}>
        <h2>Registered Users</h2>
        {users.length > 0 ? (
          <table className={styles.usersTable}>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Username</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
    </>
  );
};

export default ViewUsers;

import React, { useState, useEffect } from 'react';
import './ViewUsers.css'; // Import CSS for styling

const ViewUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from local storage or API
    const fetchUsers = () => {
      const storedUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
      setUsers(storedUsers);
    };

    fetchUsers();
  }, []);

  return (
    <div className="view-users-container">
      <h2>Registered Users</h2>
      {users.length > 0 ? (
        <table className="users-table">
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
  );
};

export default ViewUsers;

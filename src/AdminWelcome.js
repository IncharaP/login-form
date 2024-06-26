import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminWelcome.css'; // Import CSS file for styling

const AdminWelcome = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout actions if needed (e.g., clear session)
    navigate('/');
  };

  return (
    <div className="admin-welcome-container">
      <header>
        <nav>
          <ul className="nav-links">
            <li><Link to="/admin-welcome">Home</Link></li>
            <li><Link to="/add-item">Add Item</Link></li>
            <li><Link to="/edit-item">Edit Item</Link></li>
            <li><Link to="/view-users">View Users</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </ul>
        </nav>
      </header>
      <div className="content">
        <h1>Welcome, Admin!</h1>
        {/* Add more content as needed */}
      </div>
    </div>
  );
};

export default AdminWelcome;

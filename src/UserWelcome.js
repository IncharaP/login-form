import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './UserWelcome.css'; // Import CSS file for styling

const UserWelcome = ({ username }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout actions if needed (e.g., clear session)
    localStorage.removeItem('currentUser'); // Assuming currentUser is stored in localStorage
    navigate('/'); // Navigate back to the login page after logout
  };

  return (
    <div className="user-welcome-container">
      <header>
        <nav>
          <ul className="nav-links">
            <li><Link to="/user-welcome">Home</Link></li>
            <li><Link to="/view-items">View Items</Link></li>
          </ul>
        </nav>
        <div className="header-actions">
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <div className="content">
        <h1>Welcome, User {username}!</h1>
        {/* Additional content can be added here */}
      </div>
    </div>
  );
};

export default UserWelcome;

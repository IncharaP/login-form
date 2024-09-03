import React, { useState, useEffect } from 'react';
// Importing React and its hooks: useState for state management, useEffect for side effects

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Importing components from react-router-dom for routing: Router, Routes, Route

import Login from './home/Login';
import AdminWelcome from './admin/AdminWelcome';
import AddItem from './admin/AddItem';
import ViewItemAdmin from './admin/ViewItemAdmin';
import ViewUsers from './admin/ViewUsers';
import UserWelcome from './user/UserWelcome';
import ViewItems from './user/ViewItems';
import Cart from './user/Cart';
import UserOrders from './user/UserOrders';
import Register from './home/Register';
import ViewOrders from './admin/ViewOrders'; 

// Importing various components for different routes in the app

import { ItemProvider } from './context/ItemContext'; //ItemProvider is a context provider imported from ItemContext
import RequireAuth from './context/RequireAuth'; // RequireAuth is a higher-order component (HOC) that handles authentication logic.
import NotFoundPage from './home/NotFoundPage';  //  NotFoundPage is a component that renders a 404 Not Found page
import { UserProvider } from './context/UserContext';  // UserProvider is a context provider imported from UserContext.
import { OrdersProvider } from './context/OrdersContext';  // OrdersProvider is a context provider imported from OrdersContext.
// Importing context providers and other utility components

const ROLES = {
  User: 'user',
  Admin: 'admin'
};
// Defining roles for user and admin

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState('');
  // Defining state variables: loggedIn for login status, userRole for the role of the user, username for the current user's name

  useEffect(() => {  // This starts a new effect. It means we want to do something when the component loads (mounts) or updates.
    // Here, we retrieve data from the browser's storage (localStorage). We look for an item called 'currentSession' and parse it from a JSON string into a JavaScript object.
    const user = JSON.parse(localStorage.getItem('currentSession')); 
    if (user) { // Checks if user data exists. If there's a valid user object retrieved from localStorage
      setLoggedIn(true); //  This indicates that a user is logged in, triggering any UI changes or logic dependent on this state.   
      setUserRole(user.role);  // Sets the userRole state variable to the role of the logged-in user (user.role).
      setUsername(user.username); // Sets the username state variable to the username of the logged-in user (user.username).
    }
  }, []); // []: The effect runs only once when the component is first added to the DOM (mounted).
  // useEffect hook to check if there's a user session stored in localStorage when the component mounts

  const handleLogin = () => {
    // retrieves data from the browser's localstorage. it gets an item called currentsession . json.parse function converts this string back to js object and stores it in the user variable.
    const user = JSON.parse(localStorage.getItem('currentSession')); 
    if (user) { // This line checks if the user variable contains any data.
       // This line sets the loggedIn state variable to true using the setLoggedIn function. 
      setLoggedIn(true); // This indicates that the user is now considered to be logged in. 
      setUserRole(user.role);
      setUsername(user.username);
    }
  };
  // Function to handle login, setting state based on user data from localStorage

  const handleLogout = () => {
    localStorage.removeItem('currentSession'); // This line removes an item from the browser's local storage. The item has the key 'currentSession'.
    setLoggedIn(false); // means the user is now logged out.
    setUserRole(null); // Setting it to null means the user no longer has a role assigned.
    setUsername(''); // updates a state variable that tracks the user's username. Setting it to an empty string means the username is cleared.
  };
  // Function to handle logout, removing user data from localStorage and resetting state

  const onRegister = (userData) => { // This line defines a new function called onRegister that takes one parameter, userData.
     // This line retrieves the list of registered users from local storage and parses it as JSON. If no users are found, it sets registeredUsers to an empty array.
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || []; 
    // This line adds the new user data to the list of registered users and saves the updated list back to local storage as a JSON string.
    localStorage.setItem('registeredUsers', JSON.stringify([...registeredUsers, userData]));
    // This line saves the new user's data in local storage as the current session, also in JSON format.
    localStorage.setItem('currentSession', JSON.stringify(userData)); 
    setLoggedIn(true); // This line calls a function setLoggedIn with the argument true, marking the user as logged in.
    setUserRole(userData.role); // This line calls a function setUserRole with the user's role, which is part of the userData object.
    setUsername(userData.username); // This line calls a function setUsername with the user's username, also part of the userData object.
  };
  // Function to handle user registration, updating localStorage with new user data and setting state

  return (
    <Router>  {/* Router component to enable routing in the application */}
      <OrdersProvider> {/* provides order-related context to its child components. */} 
      <UserProvider>    {/* provides user-related context to its child components. */}
        <div className="App">
          <ItemProvider> {/* provides context related to items for its children. */}
            <Routes> {/* This component is used to define your application's routes. */}
                {/* This line sets up a route so that when the URL path is "/", the Login component is rendered. */}
                {/* It passes a prop onLogin to Login, which is a function (handleLogin) used for handling login actions, like storing user credentials. */}
              <Route path="/" element={<Login onLogin={handleLogin} />} />
              <Route path="/register" element={<Register onRegister={onRegister} />} />
              <Route path="/unauthorized" element={<div>Unauthorized</div>} />
              {/* Route for unauthorized access */}

              <Route element={<RequireAuth allowedRoles={[ROLES.User]} onLogout={handleLogout} />}>
              {/* Route wrapper for user-specific routes, requiring authentication and passing allowed roles and handleLogout */}
                <Route path="/user-welcome" element={<UserWelcome username={username} />} />
                <Route path="/view-items" element={<ViewItems />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/user-orders" element={<UserOrders />} />
              </Route>

              <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} onLogout={handleLogout} />}>
              {/* Route wrapper for admin-specific routes, requiring authentication and passing allowed roles and handleLogout */}
                <Route path="/admin-welcome" element={<AdminWelcome />} />
                <Route path="/add-item" element={<AddItem />} />
                <Route path="/view-item-admin" element={<ViewItemAdmin />} />
                <Route path="/view-users" element={<ViewUsers />} />
                <Route path="/view-orders" element={<ViewOrders username={username} />} />
             
              </Route>

              <Route path="*" element={<NotFoundPage />} />
              {/* Route for handling 404 not found page */}
            </Routes>
          </ItemProvider>
        </div>
      </UserProvider>
      </OrdersProvider>,
    </Router>
  );
};

export default App;
// Exporting the App component as default

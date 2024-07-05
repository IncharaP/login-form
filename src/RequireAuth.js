// RequireAuth.js
import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';

const RequireAuth = ({ allowedRoles }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('currentUser')); // Retrieve the current user from local storage

  return (
    user && allowedRoles.includes(user.role)
      ? <Outlet />
      : user
        ? <Navigate to="/NotFoundPage" state={{ from: location }} replace />
        : <Navigate to="/" state={{ from: location }} replace />
  );
};

export default RequireAuth;

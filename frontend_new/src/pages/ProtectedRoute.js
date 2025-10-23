
/*import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
//import { AuthContext } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRole }) {
  const { isAuthorized, loading } = useContext(AuthContext);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  if (!isAuthorized(allowedRole)) {
    // clear and redirect
    return <Navigate to="/login" replace />;
  }

  return children;
};*/
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}


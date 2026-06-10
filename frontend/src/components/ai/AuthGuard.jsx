import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Spinner, Alert } from 'react-bootstrap';
import { AlertTriangle } from 'lucide-react';

const AuthGuard = ({ children, requiredRoles = [] }) => {
  const { user, isAuthenticated, isInitialized } = useSelector(state => state.auth);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      // Show error message for a moment before redirecting
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isInitialized, isAuthenticated]);

  // Show loading spinner while checking authentication
  if (!isInitialized) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <Spinner animation="border" className="mb-3" />
          <h6>Checking authentication...</h6>
        </div>
      </div>
    );
  }

  // Show error message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          {showError && (
            <Alert variant="warning" className="mb-4">
              <AlertTriangle className="me-2" size={20} />
              <strong>Authentication Required</strong>
              <p className="mb-0 mt-2">Please log in to access AI Document Analysis features.</p>
            </Alert>
          )}
          <Navigate to="/login" replace />
        </div>
      </div>
    );
  }

  // Check role requirements if specified
  if (requiredRoles.length > 0 && !user?.roles?.some(role => requiredRoles.includes(role))) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Alert variant="danger" className="text-center">
          <AlertTriangle className="me-2" size={20} />
          <strong>Access Denied</strong>
          <p className="mb-0 mt-2">You don't have permission to access this feature.</p>
        </Alert>
      </div>
    );
  }

  // User is authenticated and has required permissions
  return children;
};

export default AuthGuard;

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spinner, Center, Text, VStack } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading, isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Center minH="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.500" />
          <Text>Loading...</Text>
        </VStack>
      </Center>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/user-auth" state={{ from: location }} replace />;
  }

  // Check role-based access if required role is specified
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <Center minH="100vh">
        <VStack spacing={4}>
          <Text fontSize="2xl" fontWeight="bold" color="red.500">
            Access Denied
          </Text>
          <Text color="gray.600">
            You don't have permission to access this page.
          </Text>
          <Text fontSize="sm" color="gray.500">
            Required role: {requiredRole}
          </Text>
          <Text fontSize="sm" color="gray.500">
            Your role: {user?.role || 'Unknown'}
          </Text>
        </VStack>
      </Center>
    );
  }

  // Render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;

import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ChakraProvider, extendTheme, Spinner, Center, Box } from '@chakra-ui/react';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import optimized pages
import OptimizedHome from './pages/OptimizedHome';
import UserAuthOptimized from './pages/UserAuthOptimized';
import VendorAuthOptimized from './pages/VendorAuthOptimized';
import AdminAuthOptimized from './pages/AdminAuthOptimized';
import UserDashboardOptimized from './pages/UserDashboardOptimized';

// Import components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy load heavy components for better performance with preload hints
const VendorDashboard = React.lazy(() => 
  import(/* webpackChunkName: "vendor-dashboard" */ './pages/VendorDashboard')
);
const AdminDashboardOptimized = React.lazy(() => 
  import(/* webpackChunkName: "admin-dashboard" */ './pages/AdminDashboardOptimized')
);
const ProductCatalog = React.lazy(() => 
  import(/* webpackChunkName: "product-catalog" */ './pages/ProductCatalog')
);
const ProductDetails = React.lazy(() => 
  import(/* webpackChunkName: "product-details" */ './pages/ProductDetails')
);
const ContactPage = React.lazy(() => 
  import(/* webpackChunkName: "contact-page" */ './pages/ContactPage')
);
const AboutPage = React.lazy(() => 
  import(/* webpackChunkName: "about-page" */ './pages/AboutPage')
);

// Theme configuration
const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f7ff',
      100: '#bae7ff',
      200: '#91d5ff',
      300: '#69c0ff',
      400: '#40a9ff',
      500: '#1890ff', // Primary brand color
      600: '#096dd9',
      700: '#0050b3',
      800: '#003a8c',
      900: '#002766',
    },
    secondary: {
      50: '#f6ffed',
      100: '#d9f7be',
      200: '#b7eb8f',
      300: '#95de64',
      400: '#73d13d',
      500: '#52c41a', // Secondary green
      600: '#389e0d',
      700: '#237804',
      800: '#135200',
      900: '#092b00',
    },
  },
  fonts: {
    heading: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          boxShadow: 'sm',
          borderRadius: 'lg',
          border: '1px solid',
          borderColor: 'gray.200',
        },
      },
    },
  },
});

// Optimized loading component for Suspense fallback
const LoadingFallback = React.memo(() => (
  <Center h="100vh" bg="gray.50">
    <Box textAlign="center">
      <Spinner size="xl" color="brand.500" thickness="4px" speed="0.65s" />
      <Box mt={4} fontSize="lg" color="gray.600">
        Loading...
      </Box>
    </Box>
  </Center>
));

const App = React.memo(() => {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <main style={{ flex: 1 }}>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<OptimizedHome />} />
                  
                  {/* Authentication Routes */}
                  <Route path="/user-auth" element={<UserAuthOptimized />} />
                  <Route path="/vendor-auth" element={<VendorAuthOptimized />} />
                  <Route path="/admin" element={<AdminAuthOptimized />} />
                  
                  {/* Legacy auth routes - redirect to new ones */}
                  <Route path="/login" element={<UserAuthOptimized />} />
                  <Route path="/register" element={<UserAuthOptimized />} />
                  
                  {/* Product and Info Pages */}
                  <Route path="/products" element={<ProductCatalog />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/about" element={<AboutPage />} />

                  {/* Protected User Dashboard */}
                  <Route 
                    path="/user-dashboard" 
                    element={
                      <ProtectedRoute requiredRole="ROLE_USER">
                        <UserDashboardOptimized />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Protected Vendor Routes */}
                  <Route 
                    path="/vendor-dashboard" 
                    element={
                      <ProtectedRoute requiredRole="ROLE_VENDOR">
                        <VendorDashboard />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Protected Admin Routes */}
                  <Route 
                    path="/admin-dashboard" 
                    element={
                      <ProtectedRoute requiredRole="ROLE_ADMIN">
                        <AdminDashboardOptimized />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Catch all route */}
                  <Route path="*" element={<OptimizedHome />} />
                </Routes>
              </Suspense>
            </main>
            
            {/* Toast notifications */}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
      </AuthProvider>
    </ChakraProvider>
  );
});

export default App;

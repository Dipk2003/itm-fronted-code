import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Heading,
  Alert,
  AlertIcon,
  useToast,
  Card,
  CardBody,
  Icon,
  InputGroup,
  InputRightElement,
  IconButton,
  Image,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FiShield, FiLock, FiUsers, FiTrendingUp, FiDollarSign } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const AdminAuthOptimized = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { login, requestOTP, verifyOTP, user } = useAuth();

  // Admin login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    adminCode: '', // Additional security for admin access
  });

  const [errors, setErrors] = useState({});

  // Check if user is already logged in as admin
  useEffect(() => {
    if (user && user.role === 'ROLE_ADMIN') {
      navigate('/admin-dashboard');
    }
  }, [user, navigate]);

  // Admin features for display
  const adminFeatures = [
    {
      icon: FiUsers,
      title: 'Vendor Management',
      description: 'Approve and manage vendor accounts',
    },
    {
      icon: FiTrendingUp,
      title: 'Analytics & Reports',
      description: 'Track platform performance and growth',
    },
    {
      icon: FiDollarSign,
      title: 'Revenue Tracking',
      description: 'Monitor premium subscriptions and revenue',
    },
    {
      icon: FiShield,
      title: 'Platform Security',
      description: 'Ensure platform safety and compliance',
    },
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!loginData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!loginData.password) {
      newErrors.password = 'Password is required';
    } else if (loginData.password.length < 3) {
      newErrors.password = 'Password must be at least 3 characters';
    }

    if (!loginData.adminCode) {
      newErrors.adminCode = 'Admin access code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // Request OTP for admin login
      const otpResult = await requestOTP(loginData.email, loginData.password, 'ROLE_ADMIN', loginData.adminCode);
      
      if (otpResult.success) {
        toast({
          title: 'OTP sent!',
          description: 'Check your email or phone for the OTP.',
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
        setCurrentEmail(loginData.email);
        setShowOtpVerification(true);
      } else {
        throw new Error(otpResult.message);
      }
    } catch (error) {
      toast({
        title: 'Admin login failed',
        description: error.message || 'Invalid admin credentials or access code',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOtpVerification = async (e) => {
    e.preventDefault();
    
    if (!otpCode || otpCode.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter a valid 6-digit OTP.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const otpResult = await verifyOTP(currentEmail, otpCode);
      
      if (otpResult.success) {
        toast({
          title: 'Admin login successful!',
          description: 'Welcome to the admin dashboard',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/admin-dashboard');
      } else {
        throw new Error(otpResult.message);
      }
    } catch (error) {
      toast({
        title: 'OTP Verification Failed',
        description: error.message || 'Invalid or expired OTP',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" py={12}>
      <Container maxW="6xl">
        <VStack spacing={12}>
          {/* Header Section */}
          <VStack spacing={6} textAlign="center">
            <Icon as={FiShield} w={20} h={20} color="red.500" />
            <VStack spacing={2}>
              <Heading size="2xl" color="gray.800">
                Admin Portal
              </Heading>
              <Badge colorScheme="red" px={3} py={1} borderRadius="full">
                Restricted Access
              </Badge>
            </VStack>
            <Text color="gray.600" maxW="md" fontSize="lg">
              Secure administrative access to manage the Indian Trade Mart platform
            </Text>
          </VStack>

          {/* Features Grid */}
          <Box w="full">
            <Heading size="lg" textAlign="center" mb={8} color="gray.700">
              Admin Dashboard Features
            </Heading>
            <HStack spacing={8} justify="center" flexWrap="wrap">
              {adminFeatures.map((feature, index) => (
                <Card
                  key={index}
                  maxW="250px"
                  bg="white"
                  shadow="md"
                  _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                >
                  <CardBody textAlign="center" p={6}>
                    <VStack spacing={3}>
                      <Icon
                        as={feature.icon}
                        w={10}
                        h={10}
                        color="red.500"
                      />
                      <Heading size="sm" color="gray.800">
                        {feature.title}
                      </Heading>
                      <Text fontSize="sm" color="gray.600">
                        {feature.description}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </HStack>
          </Box>

          {/* Login Form */}
          <Card shadow="xl" borderRadius="xl" maxW="md" w="full">
            <CardBody p={8}>
              <VStack spacing={6} align="stretch">
                <VStack spacing={2} textAlign="center">
                  <Icon as={FiLock} w={12} h={12} color="red.500" />
                  <Heading size="lg" color="gray.800">
                    Admin Login
                  </Heading>
                  <Text color="gray.600" fontSize="sm">
                    Enter your admin credentials to access the dashboard
                  </Text>
                </VStack>

                <Alert status="warning" borderRadius="md">
                  <AlertIcon />
                  <Text fontSize="sm">
                    This is a restricted area. Only authorized administrators can access this portal.
                  </Text>
                </Alert>

                {!showOtpVerification ? (
                  <form onSubmit={handleLogin}>
                    <VStack spacing={5}>
                    <FormControl isInvalid={errors.email}>
                      <FormLabel>Admin Email</FormLabel>
                      <Input
                        name="email"
                        type="email"
                        value={loginData.email}
                        onChange={handleInputChange}
                        placeholder="Enter admin email"
                        bg="white"
                        borderColor="gray.300"
                        _focus={{ borderColor: 'red.500', boxShadow: '0 0 0 1px red.500' }}
                      />
                      {errors.email && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.email}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isInvalid={errors.password}>
                      <FormLabel>Admin Password</FormLabel>
                      <InputGroup>
                        <Input
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          value={loginData.password}
                          onChange={handleInputChange}
                          placeholder="Enter admin password"
                          bg="white"
                          borderColor="gray.300"
                          _focus={{ borderColor: 'red.500', boxShadow: '0 0 0 1px red.500' }}
                        />
                        <InputRightElement>
                          <IconButton
                            variant="ghost"
                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                            onClick={() => setShowPassword(!showPassword)}
                            size="sm"
                          />
                        </InputRightElement>
                      </InputGroup>
                      {errors.password && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.password}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isInvalid={errors.adminCode}>
                      <FormLabel>Admin Access Code</FormLabel>
                      <Input
                        name="adminCode"
                        type="password"
                        value={loginData.adminCode}
                        onChange={handleInputChange}
                        placeholder="Enter admin access code"
                        bg="white"
                        borderColor="gray.300"
                        _focus={{ borderColor: 'red.500', boxShadow: '0 0 0 1px red.500' }}
                      />
                      {errors.adminCode && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.adminCode}
                        </Text>
                      )}
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        Contact system administrator if you don't have the access code
                      </Text>
                    </FormControl>

                      <Button
                        type="submit"
                        colorScheme="red"
                        size="lg"
                        width="full"
                        isLoading={isLoading}
                        loadingText="Requesting OTP..."
                        leftIcon={<FiShield />}
                      >
                        Request OTP
                      </Button>
                    </VStack>
                  </form>
                ) : (
                  <form onSubmit={handleOtpVerification}>
                    <VStack spacing={5}>
                      <Alert status="info" borderRadius="md">
                        <AlertIcon />
                        <Text fontSize="sm">
                          OTP has been sent to {currentEmail}. Please enter the 6-digit code.
                        </Text>
                      </Alert>
                      
                      <FormControl>
                        <FormLabel>Enter OTP</FormLabel>
                        <Input
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          bg="white"
                          textAlign="center"
                          fontSize="lg"
                          letterSpacing="wider"
                          borderColor="gray.300"
                          _focus={{ borderColor: 'red.500', boxShadow: '0 0 0 1px red.500' }}
                        />
                      </FormControl>

                      <Button
                        type="submit"
                        colorScheme="red"
                        size="lg"
                        width="full"
                        isLoading={isLoading}
                        loadingText="Verifying OTP..."
                        leftIcon={<FiShield />}
                      >
                        Verify OTP & Access Dashboard
                      </Button>

                      <Button
                        variant="outline"
                        colorScheme="red"
                        size="sm"
                        width="full"
                        onClick={() => {
                          setShowOtpVerification(false);
                          setOtpCode('');
                        }}
                      >
                        Go back
                      </Button>
                    </VStack>
                  </form>
                )}

                <Box textAlign="center" pt={4} borderTop="1px solid" borderColor="gray.200">
                  <Text fontSize="xs" color="gray.500">
                    For security purposes, all admin activities are logged and monitored.
                  </Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          {/* Security Notice */}
          <Card bg="red.50" border="1px solid" borderColor="red.200" maxW="2xl">
            <CardBody p={6}>
              <VStack spacing={3} textAlign="center">
                <Icon as={FiShield} w={8} h={8} color="red.600" />
                <Heading size="md" color="red.700">
                  Security Notice
                </Heading>
                <Text fontSize="sm" color="red.600">
                  This admin portal is protected by multiple security layers including
                  two-factor authentication, IP monitoring, and session management.
                  Unauthorized access attempts will be tracked and reported.
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default AdminAuthOptimized;

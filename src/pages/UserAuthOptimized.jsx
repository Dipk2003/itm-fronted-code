import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Heading,
  Divider,
  useToast,
  Card,
  CardBody,
  Icon,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FiUser } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../contexts/AuthContext';

const UserAuthOptimized = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { register, user, requestOTP, verifyOTP, loginWithGoogle } = useAuth();

  // OTP state
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Registration form state
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/user-dashboard');
    }
  }, [user, navigate]);

  // Check URL params for default tab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const action = params.get('action');
    if (action === 'register') {
      setActiveTab(1);
    }
  }, [location]);


  const validateRegisterForm = () => {
    const newErrors = {};
    
    if (!registerData.firstName) newErrors.firstName = 'First name is required';
    if (!registerData.lastName) newErrors.lastName = 'Last name is required';
    if (!registerData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!registerData.phone) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(registerData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    if (!registerData.password) {
      newErrors.password = 'Password is required';
    } else if (registerData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOtpForm = () => {
    const newErrors = {};
    
    if (!otp) {
      newErrors.otp = 'OTP is required';
    } else if (otp.length !== 6) {
      newErrors.otp = 'OTP must be 6 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!loginData.email) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (!loginData.password) {
      toast({
        title: 'Password required',
        description: 'Please enter your password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await requestOTP(loginData.email, loginData.password, 'ROLE_USER');
      if (result.success) {
        toast({
          title: 'OTP sent!',
          description: 'Please check your email for the OTP.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setOtpSent(true);
      } else {
        toast({
          title: 'Login failed',
          description: result.message || 'Invalid credentials',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('OTP Request Error:', error);
      toast({
        title: 'OTP Request failed',
        description: error.message || 'Failed to send OTP',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!validateOtpForm()) return;

    setIsLoading(true);
    try {
      const result = await verifyOTP(loginData.email, otp);
      if (result.success) {
        toast({
          title: 'Login Successful!',
          description: 'Welcome to Indian Trade Mart',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        // Redirect to user dashboard
        navigate('/user-dashboard');
      } else {
        toast({
          title: 'OTP Verification failed',
          description: result.message || 'Invalid or expired OTP',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('OTP Verification Error:', error);
      toast({
        title: 'OTP Verification failed',
        description: error.message || 'Invalid or expired OTP',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) return;
    
    setIsLoading(true);
    try {
      const userData = {
        ...registerData,
        role: 'ROLE_USER',
        userType: 'buyer'
      };
      delete userData.confirmPassword;
      
      await register(userData);
      toast({
        title: 'Registration successful!',
        description: 'Welcome to Indian Trade Mart. Please verify your email.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/user-dashboard');
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error.message || 'Registration failed. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginInputChange = (e) => {
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

  const handleRegisterInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
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
      <Container maxW="md">
        <Card shadow="lg" borderRadius="xl">
          <CardBody p={8}>
            <VStack spacing={6} align="stretch">
              <VStack spacing={2} textAlign="center">
                <Icon as={FiUser} w={12} h={12} color="brand.500" />
                <Heading size="lg" color="gray.800">
                  Buyer Portal
                </Heading>
                <Text color="gray.600">
                  Access India's largest B2B marketplace
                </Text>
              </VStack>

              <Tabs 
                index={activeTab} 
                onChange={setActiveTab} 
                variant="soft-rounded" 
                colorScheme="brand"
              >
                <TabList gridColumn="2" mb={6}>
                  <Tab flex={1}>Login</Tab>
                  <Tab flex={1}>Register</Tab>
                </TabList>

                <TabPanels>
                  {/* Login Panel */}
                  <TabPanel p={0}>
                    <form onSubmit={otpSent ? handleVerifyOtp : handleSendOTP}>
                      <VStack spacing={4}>
                        <FormControl isInvalid={errors.email}>
                          <FormLabel>Email Address</FormLabel>
                          <InputGroup>
                            <Input
                              name="email"
                              type="email"
                              value={loginData.email}
                              onChange={handleLoginInputChange}
                              placeholder="Enter your email"
                              bg="white"
                            />
                          </InputGroup>
                          {errors.email && (
                            <Text color="red.500" fontSize="sm" mt={1}>
                              {errors.email}
                            </Text>
                          )}
                        </FormControl>

                        <FormControl isInvalid={errors.password}>
                          <FormLabel>Password</FormLabel>
                          <InputGroup>
                            <Input
                              name="password"
                              type={showPassword ? 'text' : 'password'}
                              value={loginData.password}
                              onChange={handleLoginInputChange}
                              placeholder="Enter your password"
                              bg="white"
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

                        {otpSent && (
                          <FormControl isInvalid={errors.otp}>
                            <FormLabel>Enter OTP</FormLabel>
                            <Input
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              placeholder="Enter 6-digit OTP"
                              maxLength={6}
                              bg="white"
                            />
                            {errors.otp && (
                              <Text color="red.500" fontSize="sm" mt={1}>
                                {errors.otp}
                              </Text>
                            )}
                          </FormControl>
                        )}

                        <Button
                          type="submit"
                          colorScheme="brand"
                          size="lg"
                          width="full"
                          isLoading={isLoading}
                          loadingText={otpSent ? "Verifying OTP..." : "Sending OTP..."}
                          onClick={otpSent ? handleVerifyOtp : handleSendOTP}
                        >
                          {otpSent ? "Verify OTP" : "Send OTP"}
                        </Button>

                        <Divider />
                        
                        <Button
                          leftIcon={<FcGoogle />}
                          variant="outline"
                          size="lg"
                          width="full"
                          onClick={loginWithGoogle}
                          isDisabled={isLoading}
                        >
                          Continue with Google
                        </Button>
                        
                        <HStack justify="center" spacing={1}>
                          <Text fontSize="sm" color="gray.600">
                            Don't have an account?
                          </Text>
                          <Button
                            variant="link"
                            colorScheme="brand"
                            fontSize="sm"
                            onClick={() => setActiveTab(1)}
                          >
                            Register here
                          </Button>
                        </HStack>
                      </VStack>
                    </form>
                  </TabPanel>

                  {/* Register Panel */}
                  <TabPanel p={0}>
                    <form onSubmit={handleRegister}>
                      <VStack spacing={4}>
                        <HStack spacing={4}>
                          <FormControl isInvalid={errors.firstName}>
                            <FormLabel>First Name</FormLabel>
                            <Input
                              name="firstName"
                              value={registerData.firstName}
                              onChange={handleRegisterInputChange}
                              placeholder="First name"
                              bg="white"
                            />
                            {errors.firstName && (
                              <Text color="red.500" fontSize="sm" mt={1}>
                                {errors.firstName}
                              </Text>
                            )}
                          </FormControl>

                          <FormControl isInvalid={errors.lastName}>
                            <FormLabel>Last Name</FormLabel>
                            <Input
                              name="lastName"
                              value={registerData.lastName}
                              onChange={handleRegisterInputChange}
                              placeholder="Last name"
                              bg="white"
                            />
                            {errors.lastName && (
                              <Text color="red.500" fontSize="sm" mt={1}>
                                {errors.lastName}
                              </Text>
                            )}
                          </FormControl>
                        </HStack>

                        <FormControl isInvalid={errors.email}>
                          <FormLabel>Email Address</FormLabel>
                          <Input
                            name="email"
                            type="email"
                            value={registerData.email}
                            onChange={handleRegisterInputChange}
                            placeholder="Enter your email"
                            bg="white"
                          />
                          {errors.email && (
                            <Text color="red.500" fontSize="sm" mt={1}>
                              {errors.email}
                            </Text>
                          )}
                        </FormControl>

                        <HStack spacing={4}>
                          <FormControl isInvalid={errors.phone}>
                            <FormLabel>Phone Number</FormLabel>
                            <Input
                              name="phone"
                              value={registerData.phone}
                              onChange={handleRegisterInputChange}
                              placeholder="10-digit phone"
                              bg="white"
                            />
                            {errors.phone && (
                              <Text color="red.500" fontSize="sm" mt={1}>
                                {errors.phone}
                              </Text>
                            )}
                          </FormControl>

                          <FormControl>
                            <FormLabel>Company (Optional)</FormLabel>
                            <Input
                              name="company"
                              value={registerData.company}
                              onChange={handleRegisterInputChange}
                              placeholder="Company name"
                              bg="white"
                            />
                          </FormControl>
                        </HStack>

                        <FormControl>
                          <FormLabel>Address (Optional)</FormLabel>
                          <Input
                            name="address"
                            value={registerData.address}
                            onChange={handleRegisterInputChange}
                            placeholder="Street address"
                            bg="white"
                          />
                        </FormControl>

                        <HStack spacing={4}>
                          <FormControl>
                            <FormLabel>City</FormLabel>
                            <Input
                              name="city"
                              value={registerData.city}
                              onChange={handleRegisterInputChange}
                              placeholder="City"
                              bg="white"
                            />
                          </FormControl>

                          <FormControl>
                            <FormLabel>State</FormLabel>
                            <Input
                              name="state"
                              value={registerData.state}
                              onChange={handleRegisterInputChange}
                              placeholder="State"
                              bg="white"
                            />
                          </FormControl>

                          <FormControl>
                            <FormLabel>Pincode</FormLabel>
                            <Input
                              name="pincode"
                              value={registerData.pincode}
                              onChange={handleRegisterInputChange}
                              placeholder="Pincode"
                              bg="white"
                            />
                          </FormControl>
                        </HStack>

                        <FormControl isInvalid={errors.password}>
                          <FormLabel>Password</FormLabel>
                          <InputGroup>
                            <Input
                              name="password"
                              type={showPassword ? 'text' : 'password'}
                              value={registerData.password}
                              onChange={handleRegisterInputChange}
                              placeholder="Choose a password"
                              bg="white"
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

                        <FormControl isInvalid={errors.confirmPassword}>
                          <FormLabel>Confirm Password</FormLabel>
                          <InputGroup>
                            <Input
                              name="confirmPassword"
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={registerData.confirmPassword}
                              onChange={handleRegisterInputChange}
                              placeholder="Confirm your password"
                              bg="white"
                            />
                            <InputRightElement>
                              <IconButton
                                variant="ghost"
                                icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                size="sm"
                              />
                            </InputRightElement>
                          </InputGroup>
                          {errors.confirmPassword && (
                            <Text color="red.500" fontSize="sm" mt={1}>
                              {errors.confirmPassword}
                            </Text>
                          )}
                        </FormControl>

                        <Button
                          type="submit"
                          colorScheme="brand"
                          size="lg"
                          width="full"
                          isLoading={isLoading}
                          loadingText="Creating account..."
                        >
                          Create Account
                        </Button>

                        <HStack justify="center" spacing={1}>
                          <Text fontSize="sm" color="gray.600">
                            Already have an account?
                          </Text>
                          <Button
                            variant="link"
                            colorScheme="brand"
                            fontSize="sm"
                            onClick={() => setActiveTab(0)}
                          >
                            Sign in here
                          </Button>
                        </HStack>
                      </VStack>
                    </form>
                  </TabPanel>
                </TabPanels>
              </Tabs>

              <Divider />

              <VStack spacing={2} textAlign="center">
                <Text fontSize="sm" color="gray.600">
                  Looking to sell products?
                </Text>
                <Button
                  as={RouterLink}
                  to="/vendor-auth"
                  variant="outline"
                  colorScheme="green"
                  size="sm"
                >
                  Register as Vendor
                </Button>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};

export default UserAuthOptimized;

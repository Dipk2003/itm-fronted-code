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
  Alert,
  AlertIcon,
  Divider,
  useToast,
  Card,
  CardBody,
  Icon,
  InputGroup,
  InputRightElement,
  IconButton,
  Select,
  Textarea,
  Badge,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FiPackage, FiShield, FiTrendingUp, FiDollarSign, FiStar, FiCheck } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const VendorAuthOptimized = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { login, register, registerVendor, requestOTP, verifyOTP, vendorLogin, user } = useAuth();

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
    companyName: '',
    businessType: '',
    gstNumber: '',
    panNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    website: '',
    description: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  // Check if user is already logged in
  useEffect(() => {
    if (user && user.role === 'ROLE_VENDOR') {
      navigate('/vendor-dashboard');
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

  const businessTypes = [
    'Manufacturer',
    'Wholesaler',
    'Distributor',
    'Retailer',
    'Service Provider',
    'Exporter',
    'Importer',
    'Trading Company',
    'Other'
  ];

  const vendorBenefits = [
    'List unlimited products',
    'Advanced lead management',
    'GST & TDS tracking',
    'Premium business tools',
    'Direct buyer connections',
    'Analytics & insights',
    'Priority customer support',
    'Featured listing options'
  ];

  const validateLoginForm = () => {
    const newErrors = {};
    
    if (!loginData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!loginData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
    if (!registerData.companyName) newErrors.companyName = 'Company name is required';
    if (!registerData.businessType) newErrors.businessType = 'Business type is required';
    // GST and PAN are now optional during registration
    if (registerData.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(registerData.gstNumber)) {
      newErrors.gstNumber = 'Invalid GST format';
    }
    if (registerData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(registerData.panNumber)) {
      newErrors.panNumber = 'Invalid PAN format';
    }
    if (!registerData.address) newErrors.address = 'Address is required';
    if (!registerData.city) newErrors.city = 'City is required';
    if (!registerData.state) newErrors.state = 'State is required';
    if (!registerData.pincode) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(registerData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
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

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateLoginForm()) return;
    
    setIsLoading(true);
    try {
      const otpResult = await vendorLogin(loginData.email, loginData.password);

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
        title: 'OTP Request Failed',
        description: error.message || 'Error sending OTP for verification',
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
          title: 'Login successful!',
          description: 'Welcome back to your vendor dashboard',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/vendor-dashboard');
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

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) return;
    
    setIsLoading(true);
    try {
      const vendorData = {
        ...registerData,
        verified: false,
        approvalStatus: 'pending'
      };
      delete vendorData.confirmPassword;
      
      const result = await registerVendor(vendorData);
      
      if (result.success) {
        toast({
          title: 'Registration successful!',
          description: 'Your vendor account is pending verification. You will be notified once approved.',
          status: 'success',
          duration: 8000,
          isClosable: true,
        });
        // Don't navigate to dashboard immediately, let user verify first
        setActiveTab(0); // Switch to login tab
      } else {
        throw new Error(result.message);
      }
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
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" py={12}>
      <Container maxW="4xl">
        <VStack spacing={8}>
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Icon as={FiPackage} w={16} h={16} color="green.500" />
            <Heading size="xl" color="gray.800">
              Vendor Portal
            </Heading>
            <Text color="gray.600" maxW="md">
              Join India's largest B2B marketplace and grow your business
            </Text>
            
{/* Tax Information Verification - Coming Soon */}
            <Box 
              bg="green.50" 
              p={6} 
              borderRadius="lg" 
              border="1px solid" 
              borderColor="green.200"
              w="full"
            >
              <Heading size="md" mb={4} color="green.700" textAlign="center">
                Why Sell with Us?
              </Heading>
              <List spacing={2} columns={{ base: 1, md: 2 }}>
                {vendorBenefits.map((benefit, index) => (
                  <ListItem key={index} display="flex" alignItems="center">
                    <ListIcon as={FiCheck} color="green.500" />
                    <Text fontSize="sm">{benefit}</Text>
                  </ListItem>
                ))}
              </List>
            </Box>
          </VStack>

          <Card shadow="lg" borderRadius="xl" w="full">
            <CardBody p={8}>
              <Tabs 
                index={activeTab} 
                onChange={setActiveTab} 
                variant="soft-rounded" 
                colorScheme="green"
              >
                <TabList gridColumn="2" mb={6}>
                  <Tab flex={1}>Vendor Login</Tab>
                  <Tab flex={1}>Register as Vendor</Tab>
                </TabList>

                <TabPanels>
                  {/* Login Panel */}
                  <TabPanel p={0}>
                    {!showOtpVerification ? (
                      <form onSubmit={handleLogin}>
                        <VStack spacing={4}>
                          <FormControl isInvalid={errors.email}>
                            <FormLabel>Email Address</FormLabel>
                            <Input
                              name="email"
                              type="email"
                              value={loginData.email}
                              onChange={handleLoginInputChange}
                              placeholder="Enter your email"
                              bg="white"
                            />
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

                          <Button
                            type="submit"
                            colorScheme="green"
                            size="lg"
                            width="full"
                            isLoading={isLoading}
                            loadingText="Requesting OTP..."
                          >
                            Request OTP
                          </Button>

                          <HStack justify="center" spacing={1}>
                            <Text fontSize="sm" color="gray.600">
                              New vendor?
                            </Text>
                            <Button
                              variant="link"
                              colorScheme="green"
                              fontSize="sm"
                              onClick={() => setActiveTab(1)}
                            >
                              Register here
                            </Button>
                          </HStack>
                        </VStack>
                      </form>
                    ) : (
                      <form onSubmit={handleOtpVerification}>
                        <VStack spacing={4}>
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
                            />
                          </FormControl>

                          <Button
                            type="submit"
                            colorScheme="green"
                            size="lg"
                            width="full"
                            isLoading={isLoading}
                            loadingText="Verifying OTP..."
                          >
                            Verify OTP & Login
                          </Button>

                          <HStack justify="center" spacing={1}>
                            <Text fontSize="sm" color="gray.600">
                              Didn't receive OTP?
                            </Text>
                            <Button
                              variant="link"
                              colorScheme="green"
                              fontSize="sm"
                              onClick={() => {
                                setShowOtpVerification(false);
                                setOtpCode('');
                              }}
                            >
                              Go back
                            </Button>
                          </HStack>
                        </VStack>
                      </form>
                    )}
                  </TabPanel>

                  {/* Register Panel */}
                  <TabPanel p={0}>
                    <form onSubmit={handleRegister}>
                      <VStack spacing={6}>
                        <Alert status="info" borderRadius="md">
                          <AlertIcon />
                          <Text fontSize="sm">
                            GST and PAN details are optional during registration. You can add and verify them later in your profile.
                          </Text>
                        </Alert>

                        {/* Personal Information */}
                        <Box w="full">
                          <Heading size="md" mb={4} color="gray.700">Personal Information</Heading>
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

                            <HStack spacing={4}>
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
                            </HStack>
                          </VStack>
                        </Box>

                        {/* Business Information */}
                        <Box w="full">
                          <Heading size="md" mb={4} color="gray.700">Business Information</Heading>
                          <VStack spacing={4}>
                            <HStack spacing={4}>
                              <FormControl isInvalid={errors.companyName}>
                                <FormLabel>Company Name</FormLabel>
                                <Input
                                  name="companyName"
                                  value={registerData.companyName}
                                  onChange={handleRegisterInputChange}
                                  placeholder="Your company name"
                                  bg="white"
                                />
                                {errors.companyName && (
                                  <Text color="red.500" fontSize="sm" mt={1}>
                                    {errors.companyName}
                                  </Text>
                                )}
                              </FormControl>

                              <FormControl isInvalid={errors.businessType}>
                                <FormLabel>Business Type</FormLabel>
                                <Select
                                  name="businessType"
                                  value={registerData.businessType}
                                  onChange={handleRegisterInputChange}
                                  placeholder="Select business type"
                                  bg="white"
                                >
                                  {businessTypes.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                  ))}
                                </Select>
                                {errors.businessType && (
                                  <Text color="red.500" fontSize="sm" mt={1}>
                                    {errors.businessType}
                                  </Text>
                                )}
                              </FormControl>
                            </HStack>

                            <HStack spacing={4}>
                              <FormControl isInvalid={errors.gstNumber}>
                                <FormLabel>
                                  GST Number <Badge colorScheme="blue" variant="subtle">Optional</Badge>
                                </FormLabel>
                                <Input
                                  name="gstNumber"
                                  value={registerData.gstNumber}
                                  onChange={handleRegisterInputChange}
                                  placeholder="15-digit GST number (can be added later)"
                                  bg="white"
                                  textTransform="uppercase"
                                />
                                {errors.gstNumber && (
                                  <Text color="red.500" fontSize="sm" mt={1}>
                                    {errors.gstNumber}
                                  </Text>
                                )}
                              </FormControl>

                              <FormControl isInvalid={errors.panNumber}>
                                <FormLabel>
                                  PAN Number <Badge colorScheme="blue" variant="subtle">Optional</Badge>
                                </FormLabel>
                                <Input
                                  name="panNumber"
                                  value={registerData.panNumber}
                                  onChange={handleRegisterInputChange}
                                  placeholder="10-character PAN (can be added later)"
                                  bg="white"
                                  textTransform="uppercase"
                                />
                                {errors.panNumber && (
                                  <Text color="red.500" fontSize="sm" mt={1}>
                                    {errors.panNumber}
                                  </Text>
                                )}
                              </FormControl>
                            </HStack>

                            <FormControl>
                              <FormLabel>Website (Optional)</FormLabel>
                              <Input
                                name="website"
                                value={registerData.website}
                                onChange={handleRegisterInputChange}
                                placeholder="https://your-website.com"
                                bg="white"
                              />
                            </FormControl>

                            <FormControl>
                              <FormLabel>Business Description (Optional)</FormLabel>
                              <Textarea
                                name="description"
                                value={registerData.description}
                                onChange={handleRegisterInputChange}
                                placeholder="Describe your business, products, and services"
                                bg="white"
                                rows={3}
                              />
                            </FormControl>
                          </VStack>
                        </Box>

                        {/* Address Information */}
                        <Box w="full">
                          <Heading size="md" mb={4} color="gray.700">Address Information</Heading>
                          <VStack spacing={4}>
                            <FormControl isInvalid={errors.address}>
                              <FormLabel>Business Address</FormLabel>
                              <Input
                                name="address"
                                value={registerData.address}
                                onChange={handleRegisterInputChange}
                                placeholder="Street address"
                                bg="white"
                              />
                              {errors.address && (
                                <Text color="red.500" fontSize="sm" mt={1}>
                                  {errors.address}
                                </Text>
                              )}
                            </FormControl>

                            <HStack spacing={4}>
                              <FormControl isInvalid={errors.city}>
                                <FormLabel>City</FormLabel>
                                <Input
                                  name="city"
                                  value={registerData.city}
                                  onChange={handleRegisterInputChange}
                                  placeholder="City"
                                  bg="white"
                                />
                                {errors.city && (
                                  <Text color="red.500" fontSize="sm" mt={1}>
                                    {errors.city}
                                  </Text>
                                )}
                              </FormControl>

                              <FormControl isInvalid={errors.state}>
                                <FormLabel>State</FormLabel>
                                <Input
                                  name="state"
                                  value={registerData.state}
                                  onChange={handleRegisterInputChange}
                                  placeholder="State"
                                  bg="white"
                                />
                                {errors.state && (
                                  <Text color="red.500" fontSize="sm" mt={1}>
                                    {errors.state}
                                  </Text>
                                )}
                              </FormControl>

                              <FormControl isInvalid={errors.pincode}>
                                <FormLabel>Pincode</FormLabel>
                                <Input
                                  name="pincode"
                                  value={registerData.pincode}
                                  onChange={handleRegisterInputChange}
                                  placeholder="6-digit pincode"
                                  bg="white"
                                />
                                {errors.pincode && (
                                  <Text color="red.500" fontSize="sm" mt={1}>
                                    {errors.pincode}
                                  </Text>
                                )}
                              </FormControl>
                            </HStack>
                          </VStack>
                        </Box>

                        {/* Password Section */}
                        <Box w="full">
                          <Heading size="md" mb={4} color="gray.700">Account Security</Heading>
                          <VStack spacing={4}>
                            <FormControl isInvalid={errors.password}>
                              <FormLabel>Password</FormLabel>
                              <InputGroup>
                                <Input
                                  name="password"
                                  type={showPassword ? 'text' : 'password'}
                                  value={registerData.password}
                                  onChange={handleRegisterInputChange}
                                  placeholder="Choose a strong password"
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
                          </VStack>
                        </Box>

                        <Button
                          type="submit"
                          colorScheme="green"
                          size="lg"
                          width="full"
                          isLoading={isLoading}
                          loadingText="Creating account..."
                        >
                          Submit for Verification
                        </Button>

                        <HStack justify="center" spacing={1}>
                          <Text fontSize="sm" color="gray.600">
                            Already registered?
                          </Text>
                          <Button
                            variant="link"
                            colorScheme="green"
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

              <Divider my={6} />

              <VStack spacing={2} textAlign="center">
                <Text fontSize="sm" color="gray.600">
                  Looking to buy products?
                </Text>
                <Button
                  as={RouterLink}
                  to="/user-auth"
                  variant="outline"
                  colorScheme="blue"
                  size="sm"
                >
                  Register as Buyer
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default VendorAuthOptimized;

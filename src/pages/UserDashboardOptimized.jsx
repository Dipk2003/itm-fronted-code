import React, { useState, useEffect, Suspense, lazy, useCallback, useMemo } from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  VStack,
  HStack,
  Text,
  Heading,
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Badge,
  Avatar,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Spinner,
  Center,
  SimpleGrid,
  Icon,
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { 
  FiSearch, 
  FiShoppingCart, 
  FiHeart, 
  FiUser, 
  FiSettings, 
  FiLogOut,
  FiPackage,
  FiTrendingUp,
  FiClock,
  FiStar,
  FiFilter,
  FiGrid,
  FiList,
  FiChevronRight
} from 'react-icons/fi';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { debounce } from '../utils/performance';
import ChatBot from '../components/ChatBot';

// Lazy load components for better performance
const ProductCard = lazy(() => import('../components/ProductCard'));
const OrderHistory = lazy(() => import('../components/OrderHistory'));

const UserDashboardOptimized = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();
  const toast = useToast();
  const { user, logout } = useAuth();

  // Simulated data - replace with actual API calls
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalOrders: 0,
      favoriteProducts: 0,
      savedSearches: 0,
      recentViews: 0
    },
    recentProducts: [],
    recentOrders: [],
    recommendations: []
  });

  // Load dashboard data function
  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Simulate API call with shorter timeout for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setDashboardData({
        stats: {
          totalOrders: 15,
          favoriteProducts: 8,
          savedSearches: 3,
          recentViews: 24
        },
        recentProducts: [
          {
            id: 1,
            name: 'Industrial Machinery Parts',
            image: '/api/placeholder/150/150',
            price: '₹25,000',
            vendor: 'TechCorp Industries',
            rating: 4.5
          },
          {
            id: 2,
            name: 'Medical Equipment',
            image: '/api/placeholder/150/150',
            price: '₹45,000',
            vendor: 'MedTech Solutions',
            rating: 4.8
          },
          {
            id: 3,
            name: 'Solar Panel Systems',
            image: '/api/placeholder/150/150',
            price: '₹35,000',
            vendor: 'Green Energy Co',
            rating: 4.6
          }
        ],
        recentOrders: [
          {
            id: 'ORD001',
            date: '2024-01-05',
            status: 'Delivered',
            amount: '₹15,500',
            items: 3
          },
          {
            id: 'ORD002',
            date: '2024-01-03',
            status: 'Processing',
            amount: '₹28,900',
            items: 1
          }
        ],
        recommendations: [
          {
            id: 4,
            name: 'Electronic Components',
            image: '/api/placeholder/150/150',
            price: '₹8,500',
            vendor: 'ElectroMax',
            rating: 4.3
          }
        ]
      });
    } catch (error) {
      toast({
        title: 'Error loading dashboard',
        description: 'Please try refreshing the page',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!user || user.role !== 'ROLE_USER') {
      navigate('/user-auth');
      return;
    }
    loadDashboardData();
  }, [user, navigate, loadDashboardData]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term) => {
      // Implement search logic here
      console.log('Searching for:', term);
    }, 300),
    []
  );

  // Handle search input changes
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  }, [debouncedSearch]);


  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Logged out successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Logout failed',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'medical', label: 'Medical Equipment' },
    { value: 'industrial', label: 'Industrial Machinery' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'textiles', label: 'Textiles' },
    { value: 'automotive', label: 'Automotive' }
  ];

  if (isLoading) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Center h="100vh">
          <Spinner size="xl" color="brand.500" />
        </Center>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" borderBottom="1px solid" borderColor="gray.200" py={4}>
        <Container maxW="7xl">
          <Flex justify="space-between" align="center">
            <HStack spacing={4}>
              <Heading size="lg" color="brand.500">
                Indian Trade Mart
              </Heading>
              <Breadcrumb spacing="8px" separator={<FiChevronRight color="gray.500" />}>
                <BreadcrumbItem>
                  <BreadcrumbLink as={RouterLink} to="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink>Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
            </HStack>
            
            <HStack spacing={4}>
              <Menu>
                <MenuButton as={Button} variant="ghost" leftIcon={<Avatar size="sm" name={user?.firstName} />}>
                  {user?.firstName} {user?.lastName}
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<FiUser />} as={RouterLink} to="/profile">
                    Profile Settings
                  </MenuItem>
                  <MenuItem icon={<FiSettings />}>
                    Account Settings
                  </MenuItem>
                  <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Welcome Section */}
          <Box>
            <Heading size="lg" mb={2}>
              Welcome back, {user?.firstName}!
            </Heading>
            <Text color="gray.600">
              Discover quality products from verified suppliers across India
            </Text>
          </Box>

          {/* Stats Cards */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
            <Card>
              <CardBody textAlign="center">
                <Stat>
                  <StatLabel>Total Orders</StatLabel>
                  <StatNumber color="brand.500">{dashboardData.stats.totalOrders}</StatNumber>
                  <StatHelpText>All time</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody textAlign="center">
                <Stat>
                  <StatLabel>Favorite Products</StatLabel>
                  <StatNumber color="red.500">{dashboardData.stats.favoriteProducts}</StatNumber>
                  <StatHelpText>Saved items</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody textAlign="center">
                <Stat>
                  <StatLabel>Saved Searches</StatLabel>
                  <StatNumber color="green.500">{dashboardData.stats.savedSearches}</StatNumber>
                  <StatHelpText>Active alerts</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody textAlign="center">
                <Stat>
                  <StatLabel>Recent Views</StatLabel>
                  <StatNumber color="purple.500">{dashboardData.stats.recentViews}</StatNumber>
                  <StatHelpText>Last 30 days</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Main Content Tabs */}
          <Card>
            <CardBody p={0}>
              <Tabs index={activeTab} onChange={setActiveTab} colorScheme="brand">
                <Box px={6} pt={6}>
                  <TabList>
                    <Tab leftIcon={<FiSearch />}>Discover Products</Tab>
                    <Tab leftIcon={<FiClock />}>Recent Orders</Tab>
                    <Tab leftIcon={<FiHeart />}>Favorites</Tab>
                    <Tab leftIcon={<FiTrendingUp />}>Recommendations</Tab>
                  </TabList>
                </Box>

                <TabPanels>
                  {/* Discover Products Tab */}
                  <TabPanel p={6}>
                    <VStack spacing={6} align="stretch">
                      {/* Search and Filters */}
                      <HStack spacing={4}>
                        <InputGroup flex={1}>
                          <InputLeftElement>
                            <FiSearch color="gray.400" />
                          </InputLeftElement>
                          <Input
                            placeholder="Search products, categories, or suppliers..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            bg="white"
                          />
                        </InputGroup>
                        
                        <Select
                          maxW="200px"
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          bg="white"
                        >
                          {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </Select>
                        
                        <Button leftIcon={<FiFilter />} variant="outline">
                          Filters
                        </Button>
                        
                        <HStack>
                          <IconButton
                            icon={<FiGrid />}
                            aria-label="Grid view"
                            variant={viewMode === 'grid' ? 'solid' : 'outline'}
                            onClick={() => setViewMode('grid')}
                          />
                          <IconButton
                            icon={<FiList />}
                            aria-label="List view"
                            variant={viewMode === 'list' ? 'solid' : 'outline'}
                            onClick={() => setViewMode('list')}
                          />
                        </HStack>
                      </HStack>

                      {/* Quick Category Links */}
                      <HStack spacing={2} flexWrap="wrap">
                        {categories.slice(1).map((cat) => (
                          <Button
                            key={cat.value}
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedCategory(cat.value)}
                          >
                            {cat.label}
                          </Button>
                        ))}
                      </HStack>

                      {/* Recent Products */}
                      <Box>
                        <Heading size="md" mb={4}>Recently Viewed</Heading>
                        <Suspense fallback={<Spinner />}>
                          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                            {dashboardData.recentProducts.map((product) => (
                              <Card key={product.id} _hover={{ shadow: 'lg' }} transition="all 0.2s">
                                <CardBody>
                                  <VStack spacing={3}>
                                    <Box
                                      w="full"
                                      h="150px"
                                      bg="gray.100"
                                      borderRadius="md"
                                      display="flex"
                                      alignItems="center"
                                      justifyContent="center"
                                    >
                                      <Icon as={FiPackage} w={8} h={8} color="gray.400" />
                                    </Box>
                                    <VStack spacing={1} align="start" w="full">
                                      <Text fontWeight="semibold" noOfLines={2}>
                                        {product.name}
                                      </Text>
                                      <Text fontSize="sm" color="gray.600">
                                        by {product.vendor}
                                      </Text>
                                      <HStack justify="space-between" w="full">
                                        <Text fontWeight="bold" color="brand.500">
                                          {product.price}
                                        </Text>
                                        <HStack spacing={1}>
                                          <Icon as={FiStar} color="yellow.400" />
                                          <Text fontSize="sm">{product.rating}</Text>
                                        </HStack>
                                      </HStack>
                                    </VStack>
                                    <HStack spacing={2} w="full">
                                      <Button size="sm" colorScheme="brand" flex={1}>
                                        View Details
                                      </Button>
                                      <IconButton
                                        size="sm"
                                        icon={<FiHeart />}
                                        aria-label="Add to favorites"
                                        variant="outline"
                                      />
                                    </HStack>
                                  </VStack>
                                </CardBody>
                              </Card>
                            ))}
                          </SimpleGrid>
                        </Suspense>
                      </Box>

                      <Button colorScheme="brand" size="lg" as={RouterLink} to="/products">
                        Browse All Products
                      </Button>
                    </VStack>
                  </TabPanel>

                  {/* Recent Orders Tab */}
                  <TabPanel p={6}>
                    <VStack spacing={4} align="stretch">
                      <Heading size="md">Order History</Heading>
                      
                      {dashboardData.recentOrders.length > 0 ? (
                        <VStack spacing={4} align="stretch">
                          {dashboardData.recentOrders.map((order) => (
                            <Card key={order.id}>
                              <CardBody>
                                <HStack justify="space-between">
                                  <VStack align="start" spacing={1}>
                                    <Text fontWeight="semibold">Order #{order.id}</Text>
                                    <Text fontSize="sm" color="gray.600">
                                      {order.date} • {order.items} items
                                    </Text>
                                  </VStack>
                                  <VStack align="end" spacing={1}>
                                    <Badge 
                                      colorScheme={order.status === 'Delivered' ? 'green' : 'blue'}
                                    >
                                      {order.status}
                                    </Badge>
                                    <Text fontWeight="bold">{order.amount}</Text>
                                  </VStack>
                                </HStack>
                              </CardBody>
                            </Card>
                          ))}
                          
                          <Button variant="outline" as={RouterLink} to="/orders">
                            View All Orders
                          </Button>
                        </VStack>
                      ) : (
                        <Card>
                          <CardBody textAlign="center" py={12}>
                            <Icon as={FiPackage} w={12} h={12} color="gray.300" mb={4} />
                            <Text color="gray.500">No orders yet</Text>
                            <Button mt={4} colorScheme="brand" as={RouterLink} to="/products">
                              Start Shopping
                            </Button>
                          </CardBody>
                        </Card>
                      )}
                    </VStack>
                  </TabPanel>

                  {/* Favorites Tab */}
                  <TabPanel p={6}>
                    <VStack spacing={4} align="stretch">
                      <Heading size="md">Favorite Products</Heading>
                      <Card>
                        <CardBody textAlign="center" py={12}>
                          <Icon as={FiHeart} w={12} h={12} color="gray.300" mb={4} />
                          <Text color="gray.500">No favorite products yet</Text>
                          <Button mt={4} colorScheme="brand" as={RouterLink} to="/products">
                            Discover Products
                          </Button>
                        </CardBody>
                      </Card>
                    </VStack>
                  </TabPanel>

                  {/* Recommendations Tab */}
                  <TabPanel p={6}>
                    <VStack spacing={4} align="stretch">
                      <Heading size="md">Recommended for You</Heading>
                      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        {dashboardData.recommendations.map((product) => (
                          <Card key={product.id} _hover={{ shadow: 'lg' }} transition="all 0.2s">
                            <CardBody>
                              <VStack spacing={3}>
                                <Box
                                  w="full"
                                  h="150px"
                                  bg="gray.100"
                                  borderRadius="md"
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <Icon as={FiPackage} w={8} h={8} color="gray.400" />
                                </Box>
                                <VStack spacing={1} align="start" w="full">
                                  <Text fontWeight="semibold" noOfLines={2}>
                                    {product.name}
                                  </Text>
                                  <Text fontSize="sm" color="gray.600">
                                    by {product.vendor}
                                  </Text>
                                  <HStack justify="space-between" w="full">
                                    <Text fontWeight="bold" color="brand.500">
                                      {product.price}
                                    </Text>
                                    <HStack spacing={1}>
                                      <Icon as={FiStar} color="yellow.400" />
                                      <Text fontSize="sm">{product.rating}</Text>
                                    </HStack>
                                  </HStack>
                                </VStack>
                                <Button size="sm" colorScheme="brand" w="full">
                                  View Details
                                </Button>
                              </VStack>
                            </CardBody>
                          </Card>
                        ))}
                      </SimpleGrid>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
          </Card>
        </VStack>
      </Container>
      
      {/* ChatBot Component */}
      <ChatBot />
    </Box>
  );
};

export default UserDashboardOptimized;

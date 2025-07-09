import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  VStack,
  HStack,
  Text,
  Heading,
  Card,
  CardBody,
  CardHeader,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Button,
  Badge,
  Icon,
  Progress,
  useColorModeValue,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Avatar,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SimpleGrid,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react';
import {
  FiUser,
  FiPackage,
  FiTrendingUp,
  FiShoppingBag,
  FiDollarSign,
  FiEye,
  FiPlus,
  FiSettings,
  FiAward,
  FiBarChart2,
  FiLogOut
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import vendorService from '../services/vendorService';
import ProfileCompletion from '../components/vendor/ProfileCompletion';
import ProductManagement from '../components/vendor/ProductManagement';
import LeadManagement from '../components/vendor/LeadManagement';

const VendorDashboard = () => {
  const { user, logout } = useAuth();
  const taxProfile = null; // Placeholder for tax profile
  const vendorRanking = null; // Placeholder for vendor ranking
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const toast = useToast();
  const navigate = useNavigate();
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data for now since we don't have user ID
      const stats = {
        totalProducts: 0,
        activeListings: 0,
        totalOrders: 0,
        totalRevenue: 0,
        monthlyGrowth: 0,
        totalLeads: 0,
        performanceScore: 75.5,
        soldProducts: 0
      };
      setDashboardStats(stats);
    } catch (error) {
      toast({
        title: "Error loading dashboard",
        description: "Could not fetch dashboard data",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getVendorTypeColor = (type) => {
    const colors = {
      DIAMOND: 'purple',
      PLATINUM: 'blue',
      GOLD: 'yellow',
      BASIC: 'gray'
    };
    return colors[type] || 'gray';
  };

  const getVendorTypeIcon = (type) => {
    const icons = {
      DIAMOND: '💎',
      PLATINUM: '🥈',
      GOLD: '🥇',
      BASIC: '🏷️'
    };
    return icons[type] || '🏷️';
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Logged out successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/vendor-auth');
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

  if (!user) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="warning">
          <AlertIcon />
          <AlertTitle>Access Denied!</AlertTitle>
          <AlertDescription>Please login to access vendor dashboard.</AlertDescription>
        </Alert>
      </Container>
    );
  }

  // Check if profile is incomplete
  const isProfileIncomplete = false; // Temporarily set to false since we don't have taxProfile

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <HStack justify="space-between" align="center" mb={6}>
              <VStack align="start" spacing={2}>
                <Heading size="lg" color="teal.500">
                  🏬 Vendor Dashboard
                </Heading>
                <Text color="gray.600">
                  Welcome back, {user.name || user.email}!
                </Text>
              </VStack>
              
              <HStack spacing={4}>
                <Badge 
                  colorScheme={getVendorTypeColor('BASIC')} 
                  size="lg" 
                  px={3} 
                  py={1}
                  borderRadius="full"
                >
                  {getVendorTypeIcon('BASIC')} BASIC
                </Badge>
                <Menu>
                  <MenuButton as={Button} variant="ghost" leftIcon={<Avatar size="sm" name={user.name || user.email} />}>
                    {user?.name || user?.email}
                  </MenuButton>
                  <MenuList>
                    <MenuItem icon={<FiUser />}>
                      Profile Settings
                    </MenuItem>
                    <MenuItem icon={<FiSettings />}>
                      Account Settings
                    </MenuItem>
                    <MenuItem icon={<FiLogOut />} onClick={handleLogout} color="red.500">
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            </HStack>

            {/* Profile Completion Alert */}
            {isProfileIncomplete && (
              <Alert status="warning" borderRadius="lg" mb={6}>
                <AlertIcon />
                <Box>
                  <AlertTitle>Complete Your Profile!</AlertTitle>
                  <AlertDescription>
                    Please complete your business profile to start listing products and accessing all features.
                  </AlertDescription>
                </Box>
                <Button 
                  colorScheme="orange" 
                  ml="auto" 
                  onClick={() => setSelectedTab(1)}
                >
                  Complete Now
                </Button>
              </Alert>
            )}
          </Box>

          {/* Dashboard Stats */}
          {!loading && dashboardStats && (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              <Card bg={cardBg} border="1px" borderColor={borderColor}>
                <CardBody>
                  <Stat>
                    <StatLabel>
                      <HStack>
                        <Icon as={FiPackage} color="blue.500" />
                        <Text>Total Products</Text>
                      </HStack>
                    </StatLabel>
                    <StatNumber color="blue.500">{dashboardStats.totalProducts}</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      Active listings: {dashboardStats.activeListings}
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card bg={cardBg} border="1px" borderColor={borderColor}>
                <CardBody>
                  <Stat>
                    <StatLabel>
                      <HStack>
                        <Icon as={FiTrendingUp} color="green.500" />
                        <Text>Total Leads</Text>
                      </HStack>
                    </StatLabel>
                    <StatNumber color="green.500">{dashboardStats.totalLeads}</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      This month
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card bg={cardBg} border="1px" borderColor={borderColor}>
                <CardBody>
                  <Stat>
                    <StatLabel>
                      <HStack>
                        <Icon as={FiAward} color="purple.500" />
                        <Text>Performance Score</Text>
                      </HStack>
                    </StatLabel>
                    <StatNumber color="purple.500">{dashboardStats.performanceScore.toFixed(1)}</StatNumber>
                    <Progress 
                      value={dashboardStats.performanceScore} 
                      colorScheme="purple" 
                      size="sm" 
                      mt={2}
                    />
                  </Stat>
                </CardBody>
              </Card>

              <Card bg={cardBg} border="1px" borderColor={borderColor}>
                <CardBody>
                  <Stat>
                    <StatLabel>
                      <HStack>
                        <Icon as={FiShoppingBag} color="orange.500" />
                        <Text>Products Sold</Text>
                      </HStack>
                    </StatLabel>
                    <StatNumber color="orange.500">{dashboardStats.soldProducts}</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      All time
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </SimpleGrid>
          )}

          {/* Main Content Tabs */}
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardBody p={0}>
              <Tabs index={selectedTab} onChange={setSelectedTab} variant="line" colorScheme="teal">
                <TabList px={6} pt={4}>
                  <Tab>
                    <Icon as={FiBarChart2} mr={2} />
                    Overview
                  </Tab>
                  <Tab>
                    <Icon as={FiUser} mr={2} />
                    Profile Setup
                  </Tab>
                  <Tab>
                    <Icon as={FiPackage} mr={2} />
                    Products
                  </Tab>
                  <Tab>
                    <Icon as={FiTrendingUp} mr={2} />
                    Leads
                  </Tab>
                  <Tab>
                    <Icon as={FiSettings} mr={2} />
                    Settings
                  </Tab>
                </TabList>

                <TabPanels>
                  {/* Overview Tab */}
                  <TabPanel p={6}>
                    <VStack spacing={6} align="stretch">
                      <Heading size="md">📊 Business Overview</Heading>
                      
                      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                        {/* Quick Actions */}
                        <Card>
                          <CardHeader>
                            <Heading size="sm">🚀 Quick Actions</Heading>
                          </CardHeader>
                          <CardBody>
                            <VStack spacing={3}>
                              <Button 
                                leftIcon={<FiPlus />} 
                                colorScheme="teal" 
                                w="full"
                                onClick={() => setSelectedTab(2)}
                              >
                                Add New Product
                              </Button>
                              <Button 
                                leftIcon={<FiEye />} 
                                variant="outline" 
                                w="full"
                                onClick={() => setSelectedTab(3)}
                              >
                                View Leads
                              </Button>
                              <Button 
                                leftIcon={<FiSettings />} 
                                variant="outline" 
                                w="full"
                                onClick={() => setSelectedTab(4)}
                              >
                                Account Settings
                              </Button>
                            </VStack>
                          </CardBody>
                        </Card>

                        {/* Recent Activity */}
                        <Card>
                          <CardHeader>
                            <Heading size="sm">📈 Recent Activity</Heading>
                          </CardHeader>
                          <CardBody>
                            <VStack spacing={3} align="stretch">
                              <Text fontSize="sm" color="gray.600">
                                • Product "Sample Item" was viewed 5 times today
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                • 2 new leads generated this week
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                • Profile completion: {taxProfile ? '100%' : '30%'}
                              </Text>
                              <Divider />
                              <Button size="sm" variant="ghost" colorScheme="teal">
                                View All Activity
                              </Button>
                            </VStack>
                          </CardBody>
                        </Card>
                      </SimpleGrid>
                    </VStack>
                  </TabPanel>

                  {/* Profile Setup Tab */}
                  <TabPanel p={6}>
                    <ProfileCompletion />
                  </TabPanel>

                  {/* Products Tab */}
                  <TabPanel p={6}>
                    <ProductManagement />
                  </TabPanel>

                  {/* Leads Tab */}
                  <TabPanel p={6}>
                    <LeadManagement />
                  </TabPanel>

                  {/* Settings Tab */}
                  <TabPanel p={6}>
                    <VStack spacing={6} align="stretch">
                      <Heading size="md">⚙️ Account Settings</Heading>
                      <Text color="gray.600">Manage your account preferences and settings.</Text>
                      
                      <Card>
                        <CardBody>
                          <VStack spacing={4} align="stretch">
                            <Text fontWeight="bold">Account Information</Text>
                            <Text>Email: {user.email}</Text>
                            <Text>Member since: {new Date().toLocaleDateString()}</Text>
                            <Text>Vendor Type: BASIC</Text>
                            
                            <Divider />
                            
                            <Button colorScheme="red" variant="outline" size="sm" maxW="200px">
                              Delete Account
                            </Button>
                          </VStack>
                        </CardBody>
                      </Card>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default VendorDashboard;

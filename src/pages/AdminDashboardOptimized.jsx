import React, { useState, useEffect, Suspense, lazy } from 'react';
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
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
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
  Avatar,
  Progress,
  Divider,
  Alert,
  AlertIcon,
  useColorModeValue,
} from '@chakra-ui/react';
import { 
  FiUsers, 
  FiDollarSign, 
  FiTrendingUp, 
  FiEye,
  FiPackage,
  FiStar,
  FiSettings,
  FiLogOut,
  FiShield,
  FiBarChart,
  FiPieChart,
  FiActivity,
  FiAward,
  FiCreditCard,
  FiCalendar,
  FiFilter,
  FiDownload,
  FiRefreshCw
} from 'react-icons/fi';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboardOptimized = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const navigate = useNavigate();
  const toast = useToast();
  const { user, logout } = useAuth();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Comprehensive dashboard data
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalVendors: 0,
      activeVendors: 0,
      pendingApprovals: 0,
      totalVisitors: 0,
      monthlyVisitors: 0,
      totalRevenue: 0,
      monthlyRevenue: 0,
      premiumSubscriptions: 0,
      leadsPurchased: 0
    },
    vendors: [],
    revenueData: [],
    visitorData: [],
    premiumPackages: [],
    leadPurchases: [],
    gstReports: [],
    tdsReports: []
  });

  useEffect(() => {
    if (!user || user.role !== 'ROLE_ADMIN') {
      navigate('/admin');
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setDashboardData({
        overview: {
          totalVendors: 156,
          activeVendors: 142,
          pendingApprovals: 14,
          totalVisitors: 45230,
          monthlyVisitors: 12800,
          totalRevenue: 2450000,
          monthlyRevenue: 189000,
          premiumSubscriptions: 89,
          leadsPurchased: 1240
        },
        vendors: [
          {
            id: 1,
            name: 'TechCorp Industries',
            email: 'admin@techcorp.com',
            status: 'approved',
            joinDate: '2024-01-15',
            premiumPack: 'Gold',
            leadsPurchased: 45,
            revenue: '₹25,000',
            gstNumber: '27ABCDE1234F1Z5'
          },
          {
            id: 2,
            name: 'MedTech Solutions',
            email: 'info@medtech.com',
            status: 'pending',
            joinDate: '2024-01-20',
            premiumPack: 'Silver',
            leadsPurchased: 12,
            revenue: '₹8,500',
            gstNumber: '29FGHIJ5678K2L8'
          },
          {
            id: 3,
            name: 'Green Energy Co',
            email: 'contact@greenenergy.com',
            status: 'approved',
            joinDate: '2024-01-10',
            premiumPack: 'Platinum',
            leadsPurchased: 78,
            revenue: '₹45,000',
            gstNumber: '06MNOPQ9012R3S4'
          }
        ],
        revenueData: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Monthly Revenue',
            data: [125000, 145000, 165000, 189000, 210000, 189000],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4
          }]
        },
        visitorData: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Daily Visitors',
            data: [1200, 1450, 1680, 1520, 1890, 2100, 1750],
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 1
          }]
        },
        premiumPackages: [
          {
            id: 1,
            vendorName: 'TechCorp Industries',
            packageType: 'Gold',
            amount: '₹15,000',
            purchaseDate: '2024-01-15',
            expiryDate: '2024-04-15',
            status: 'active'
          },
          {
            id: 2,
            vendorName: 'Green Energy Co',
            packageType: 'Platinum',
            amount: '₹25,000',
            purchaseDate: '2024-01-10',
            expiryDate: '2024-04-10',
            status: 'active'
          }
        ],
        leadPurchases: [
          {
            id: 1,
            vendorName: 'TechCorp Industries',
            leadsCount: 45,
            amount: '₹4,500',
            purchaseDate: '2024-01-22',
            category: 'Electronics'
          },
          {
            id: 2,
            vendorName: 'Green Energy Co',
            leadsCount: 78,
            amount: '₹7,800',
            purchaseDate: '2024-01-21',
            category: 'Solar Equipment'
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
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
    toast({
      title: 'Dashboard refreshed',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleVendorApproval = async (vendorId, action) => {
    try {
      // Simulate API call
      toast({
        title: `Vendor ${action}`,
        description: `Vendor has been ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
        status: action === 'approve' ? 'success' : 'warning',
        duration: 3000,
        isClosable: true,
      });
      await loadDashboardData();
    } catch (error) {
      toast({
        title: 'Action failed',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
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
      navigate('/admin');
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

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (isLoading) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Center h="100vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="red.500" />
            <Text>Loading admin dashboard...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" borderBottom="1px solid" borderColor={borderColor} py={4}>
        <Container maxW="7xl">
          <Flex justify="space-between" align="center">
            <HStack spacing={4}>
              <Icon as={FiShield} w={8} h={8} color="red.500" />
              <VStack align="start" spacing={0}>
                <Heading size="lg" color="red.500">
                  Admin Dashboard
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Indian Trade Mart Management Portal
                </Text>
              </VStack>
            </HStack>
            
            <HStack spacing={4}>
              <IconButton
                icon={<FiRefreshCw />}
                aria-label="Refresh"
                onClick={handleRefresh}
                isLoading={refreshing}
                variant="ghost"
              />
              <Menu>
                <MenuButton as={Button} variant="ghost" leftIcon={<Avatar size="sm" bg="red.500" />}>
                  Admin Panel
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<FiSettings />}>
                    System Settings
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
          {/* Key Metrics */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
            <Card bg={bgColor}>
              <CardBody textAlign="center">
                <Stat>
                  <StatLabel>Total Vendors</StatLabel>
                  <StatNumber color="blue.500">{dashboardData.overview.totalVendors}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    12% this month
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            
            <Card bg={bgColor}>
              <CardBody textAlign="center">
                <Stat>
                  <StatLabel>Total Visitors</StatLabel>
                  <StatNumber color="green.500">{dashboardData.overview.totalVisitors.toLocaleString()}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    {dashboardData.overview.monthlyVisitors.toLocaleString()} this month
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            
            <Card bg={bgColor}>
              <CardBody textAlign="center">
                <Stat>
                  <StatLabel>Total Revenue</StatLabel>
                  <StatNumber color="purple.500">₹{(dashboardData.overview.totalRevenue / 100000).toFixed(1)}L</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    ₹{(dashboardData.overview.monthlyRevenue / 1000).toFixed(0)}K this month
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            
            <Card bg={bgColor}>
              <CardBody textAlign="center">
                <Stat>
                  <StatLabel>Premium Users</StatLabel>
                  <StatNumber color="orange.500">{dashboardData.overview.premiumSubscriptions}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    15% conversion rate
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Main Content Tabs */}
          <Card bg={bgColor}>
            <CardBody p={0}>
              <Tabs index={activeTab} onChange={setActiveTab} colorScheme="red">
                <Box px={6} pt={6}>
                  <TabList>
                    <Tab leftIcon={<FiUsers />}>Vendor Management</Tab>
                    <Tab leftIcon={<FiBarChart />}>Analytics & Revenue</Tab>
                    <Tab leftIcon={<FiAward />}>Premium Packages</Tab>
                    <Tab leftIcon={<FiCreditCard />}>Lead Purchases</Tab>
                    <Tab leftIcon={<FiActivity />}>GST & TDS Reports</Tab>
                  </TabList>
                </Box>

                <TabPanels>
                  {/* Vendor Management Tab */}
                  <TabPanel p={6}>
                    <VStack spacing={6} align="stretch">
                      <HStack justify="space-between">
                        <Heading size="md">Vendor Approvals & Management</Heading>
                        <HStack>
                          <Badge colorScheme="yellow" px={3} py={1}>
                            {dashboardData.overview.pendingApprovals} Pending Approvals
                          </Badge>
                          <Button leftIcon={<FiDownload />} size="sm" variant="outline">
                            Export Data
                          </Button>
                        </HStack>
                      </HStack>

                      <TableContainer>
                        <Table variant="simple">
                          <Thead>
                            <Tr>
                              <Th>Vendor Details</Th>
                              <Th>Status</Th>
                              <Th>Premium Pack</Th>
                              <Th>Leads Purchased</Th>
                              <Th>Revenue</Th>
                              <Th>Actions</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {dashboardData.vendors.map((vendor) => (
                              <Tr key={vendor.id}>
                                <Td>
                                  <VStack align="start" spacing={1}>
                                    <Text fontWeight="semibold">{vendor.name}</Text>
                                    <Text fontSize="sm" color="gray.600">{vendor.email}</Text>
                                    <Text fontSize="xs" color="gray.500">GST: {vendor.gstNumber}</Text>
                                  </VStack>
                                </Td>
                                <Td>
                                  <Badge 
                                    colorScheme={vendor.status === 'approved' ? 'green' : 'yellow'}
                                  >
                                    {vendor.status}
                                  </Badge>
                                </Td>
                                <Td>
                                  <Badge 
                                    colorScheme={vendor.premiumPack === 'Platinum' ? 'purple' : 
                                               vendor.premiumPack === 'Gold' ? 'yellow' : 'gray'}
                                  >
                                    {vendor.premiumPack}
                                  </Badge>
                                </Td>
                                <Td>{vendor.leadsPurchased}</Td>
                                <Td fontWeight="semibold">{vendor.revenue}</Td>
                                <Td>
                                  <HStack spacing={2}>
                                    {vendor.status === 'pending' && (
                                      <>
                                        <Button
                                          size="sm"
                                          colorScheme="green"
                                          onClick={() => handleVendorApproval(vendor.id, 'approve')}
                                        >
                                          Approve
                                        </Button>
                                        <Button
                                          size="sm"
                                          colorScheme="red"
                                          variant="outline"
                                          onClick={() => handleVendorApproval(vendor.id, 'reject')}
                                        >
                                          Reject
                                        </Button>
                                      </>
                                    )}
                                    <IconButton
                                      size="sm"
                                      icon={<FiEye />}
                                      aria-label="View details"
                                      variant="ghost"
                                    />
                                  </HStack>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </VStack>
                  </TabPanel>

                  {/* Analytics & Revenue Tab */}
                  <TabPanel p={6}>
                    <VStack spacing={8} align="stretch">
                      <Heading size="md">Platform Analytics & Revenue Insights</Heading>
                      
                      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                        <Card>
                          <CardHeader>
                            <Heading size="sm">Revenue Trend</Heading>
                          </CardHeader>
                          <CardBody>
                            <Box h="300px">
                              <Line data={dashboardData.revenueData} options={chartOptions} />
                            </Box>
                          </CardBody>
                        </Card>

                        <Card>
                          <CardHeader>
                            <Heading size="sm">Daily Visitors</Heading>
                          </CardHeader>
                          <CardBody>
                            <Box h="300px">
                              <Bar data={dashboardData.visitorData} options={chartOptions} />
                            </Box>
                          </CardBody>
                        </Card>
                      </SimpleGrid>

                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                        <Card textAlign="center">
                          <CardBody>
                            <Stat>
                              <StatLabel>Avg. Session Duration</StatLabel>
                              <StatNumber>4:32</StatNumber>
                              <StatHelpText>+2.3% from last week</StatHelpText>
                            </Stat>
                          </CardBody>
                        </Card>

                        <Card textAlign="center">
                          <CardBody>
                            <Stat>
                              <StatLabel>Bounce Rate</StatLabel>
                              <StatNumber>32.4%</StatNumber>
                              <StatHelpText>-1.8% from last week</StatHelpText>
                            </Stat>
                          </CardBody>
                        </Card>

                        <Card textAlign="center">
                          <CardBody>
                            <Stat>
                              <StatLabel>Conversion Rate</StatLabel>
                              <StatNumber>2.8%</StatNumber>
                              <StatHelpText>+0.5% from last week</StatHelpText>
                            </Stat>
                          </CardBody>
                        </Card>
                      </SimpleGrid>
                    </VStack>
                  </TabPanel>

                  {/* Premium Packages Tab */}
                  <TabPanel p={6}>
                    <VStack spacing={6} align="stretch">
                      <HStack justify="space-between">
                        <Heading size="md">Premium Package Subscriptions</Heading>
                        <Button leftIcon={<FiDownload />} size="sm" variant="outline">
                          Export Report
                        </Button>
                      </HStack>

                      <TableContainer>
                        <Table variant="simple">
                          <Thead>
                            <Tr>
                              <Th>Vendor</Th>
                              <Th>Package Type</Th>
                              <Th>Amount</Th>
                              <Th>Purchase Date</Th>
                              <Th>Expiry Date</Th>
                              <Th>Status</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {dashboardData.premiumPackages.map((pkg) => (
                              <Tr key={pkg.id}>
                                <Td fontWeight="semibold">{pkg.vendorName}</Td>
                                <Td>
                                  <Badge 
                                    colorScheme={pkg.packageType === 'Platinum' ? 'purple' : 'yellow'}
                                  >
                                    {pkg.packageType}
                                  </Badge>
                                </Td>
                                <Td fontWeight="semibold">{pkg.amount}</Td>
                                <Td>{pkg.purchaseDate}</Td>
                                <Td>{pkg.expiryDate}</Td>
                                <Td>
                                  <Badge colorScheme="green">{pkg.status}</Badge>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </VStack>
                  </TabPanel>

                  {/* Lead Purchases Tab */}
                  <TabPanel p={6}>
                    <VStack spacing={6} align="stretch">
                      <HStack justify="space-between">
                        <Heading size="md">Lead Purchase Analytics</Heading>
                        <HStack>
                          <Text fontSize="sm" color="gray.600">
                            Total Leads Sold: {dashboardData.overview.leadsPurchased}
                          </Text>
                          <Button leftIcon={<FiDownload />} size="sm" variant="outline">
                            Export Data
                          </Button>
                        </HStack>
                      </HStack>

                      <TableContainer>
                        <Table variant="simple">
                          <Thead>
                            <Tr>
                              <Th>Vendor</Th>
                              <Th>Leads Count</Th>
                              <Th>Amount</Th>
                              <Th>Category</Th>
                              <Th>Purchase Date</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {dashboardData.leadPurchases.map((purchase) => (
                              <Tr key={purchase.id}>
                                <Td fontWeight="semibold">{purchase.vendorName}</Td>
                                <Td>{purchase.leadsCount}</Td>
                                <Td fontWeight="semibold" color="green.500">{purchase.amount}</Td>
                                <Td>
                                  <Badge variant="outline">{purchase.category}</Badge>
                                </Td>
                                <Td>{purchase.purchaseDate}</Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </VStack>
                  </TabPanel>

                  {/* GST & TDS Reports Tab */}
                  <TabPanel p={6}>
                    <VStack spacing={6} align="stretch">
                      <Heading size="md">GST & TDS Compliance Reports</Heading>
                      
                      <Alert status="info">
                        <AlertIcon />
                        Tax reports are generated automatically for all vendor transactions and can be downloaded for compliance purposes.
                      </Alert>

                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <Card>
                          <CardHeader>
                            <Heading size="sm">GST Summary</Heading>
                          </CardHeader>
                          <CardBody>
                            <VStack spacing={4} align="stretch">
                              <HStack justify="space-between">
                                <Text>Total GST Collected:</Text>
                                <Text fontWeight="bold">₹4,42,800</Text>
                              </HStack>
                              <HStack justify="space-between">
                                <Text>CGST (9%):</Text>
                                <Text>₹2,21,400</Text>
                              </HStack>
                              <HStack justify="space-between">
                                <Text>SGST (9%):</Text>
                                <Text>₹2,21,400</Text>
                              </HStack>
                              <Divider />
                              <Button colorScheme="blue" size="sm">
                                Download GST Report
                              </Button>
                            </VStack>
                          </CardBody>
                        </Card>

                        <Card>
                          <CardHeader>
                            <Heading size="sm">TDS Summary</Heading>
                          </CardHeader>
                          <CardBody>
                            <VStack spacing={4} align="stretch">
                              <HStack justify="space-between">
                                <Text>Total TDS Deducted:</Text>
                                <Text fontWeight="bold">₹49,000</Text>
                              </HStack>
                              <HStack justify="space-between">
                                <Text>TDS Rate (2%):</Text>
                                <Text>Applied on all vendor payments</Text>
                              </HStack>
                              <HStack justify="space-between">
                                <Text>Vendors Affected:</Text>
                                <Text>89 vendors</Text>
                              </HStack>
                              <Divider />
                              <Button colorScheme="green" size="sm">
                                Download TDS Report
                              </Button>
                            </VStack>
                          </CardBody>
                        </Card>
                      </SimpleGrid>
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

export default AdminDashboardOptimized;

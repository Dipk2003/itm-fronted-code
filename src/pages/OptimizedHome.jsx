import React, { Suspense, lazy } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardBody,
  Icon,
  Badge,
  Flex,
  Center,
  Image,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  FiTrendingUp,
  FiShield,
  FiUsers,
  FiPackage,
  FiStar,
  FiShoppingCart,
  FiUser,
  FiSettings,
} from 'react-icons/fi';

// Lazy load heavy components
const ProductCatalog = lazy(() => import('./ProductCatalog'));

const OptimizedHome = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  const userTypes = [
    {
      type: 'buyer',
      title: 'I am a Buyer',
      description: 'Looking to purchase products for my business',
      icon: FiShoppingCart,
      color: 'blue',
      features: ['Browse Products', 'Compare Prices', 'Direct Contact with Sellers', 'Bulk Order Management'],
      cta: 'Start Buying',
      route: '/user-auth?type=buyer'
    },
    {
      type: 'seller',
      title: 'I am a Seller/Vendor',
      description: 'Want to list my products and reach more customers',
      icon: FiPackage,
      color: 'green',
      features: ['List Products', 'Manage Inventory', 'Lead Management', 'Premium Business Tools'],
      cta: 'Start Selling',
      route: '/vendor-auth'
    }
  ];

  const features = [
    {
      icon: FiShield,
      title: 'Verified Business Network',
      description: 'All sellers verified through PAN, GST, and business documents',
      color: 'green',
    },
    {
      icon: FiTrendingUp,
      title: 'Advanced CRM & Analytics',
      description: 'Track leads, sales, and business growth with detailed analytics',
      color: 'blue',
    },
    {
      icon: FiUsers,
      title: 'B2B Marketplace',
      description: 'Connect with genuine business buyers and sellers across India',
      color: 'purple',
    },
    {
      icon: FiStar,
      title: 'Premium Business Tools',
      description: 'GST management, TDS tracking, and premium lead generation',
      color: 'orange',
    },
  ];

  const stats = [
    { label: 'Verified Vendors', value: '1,200+' },
    { label: 'Products Listed', value: '75,000+' },
    { label: 'Successful Deals', value: '15,000+' },
    { label: 'Monthly Visitors', value: '50,000+' },
  ];

  return (
    <Box>
      {/* Hero Section with User Type Selection */}
      <Box
        bgGradient="linear(to-r, brand.500, brand.600)"
        color="white"
        py={20}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="7xl" position="relative" zIndex={1}>
          <VStack spacing={8} textAlign="center">
            <Heading
              fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
              fontWeight="bold"
              lineHeight="shorter"
            >
              India's Leading{' '}
              <Text as="span" color="yellow.300">
                B2B Trade Platform
              </Text>
            </Heading>
            
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              maxW="2xl"
              opacity={0.9}
            >
              Connect with verified sellers and buyers across India. Manage your business
              with advanced tools for growth and success.
            </Text>
            
            {/* User Type Selection Cards */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full" maxW="4xl" mt={8}>
              {userTypes.map((userType, index) => (
                <Card
                  key={index}
                  bg="whiteAlpha.200"
                  backdropFilter="blur(10px)"
                  border="1px solid"
                  borderColor="whiteAlpha.300"
                  _hover={{
                    transform: 'translateY(-4px)',
                    bg: 'whiteAlpha.300',
                    shadow: 'xl',
                  }}
                  transition="all 0.3s ease"
                  cursor="pointer"
                  as={RouterLink}
                  to={userType.route}
                >
                  <CardBody textAlign="center" p={6}>
                    <VStack spacing={4}>
                      <Box
                        p={4}
                        borderRadius="full"
                        bg={`${userType.color}.400`}
                      >
                        <Icon
                          as={userType.icon}
                          w={8}
                          h={8}
                          color="white"
                        />
                      </Box>
                      <Heading fontSize="xl" color="white">
                        {userType.title}
                      </Heading>
                      <Text color="whiteAlpha.800" fontSize="sm">
                        {userType.description}
                      </Text>
                      <VStack spacing={1} align="start" w="full">
                        {userType.features.map((feature, idx) => (
                          <Text key={idx} fontSize="xs" color="whiteAlpha.700">
                            • {feature}
                          </Text>
                        ))}
                      </VStack>
                      <Button
                        colorScheme={userType.color}
                        variant="solid"
                        size="sm"
                        w="full"
                      >
                        {userType.cta}
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box py={16} bg={bgColor}>
        <Container maxW="7xl">
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
            {stats.map((stat, index) => (
              <Center key={index}>
                <VStack spacing={2}>
                  <Text fontSize="3xl" fontWeight="bold" color="brand.500">
                    {stat.value}
                  </Text>
                  <Text color={textColor} textAlign="center" fontSize="sm">
                    {stat.label}
                  </Text>
                </VStack>
              </Center>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20} bg="gray.50">
        <Container maxW="7xl">
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center">
              <Heading fontSize="4xl" color="gray.800">
                Why Choose Indian Trade Mart?
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                We provide everything you need to grow your business and connect
                with the right partners in the Indian market.
              </Text>
            </VStack>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
              {features.map((feature, index) => (
                <Card
                  key={index}
                  height="full"
                  _hover={{
                    transform: 'translateY(-4px)',
                    shadow: 'lg',
                  }}
                  transition="all 0.2s"
                >
                  <CardBody textAlign="center" p={8}>
                    <VStack spacing={4}>
                      <Box
                        p={4}
                        borderRadius="full"
                        bg={`${feature.color}.100`}
                      >
                        <Icon
                          as={feature.icon}
                          w={8}
                          h={8}
                          color={`${feature.color}.500`}
                        />
                      </Box>
                      <Heading fontSize="xl" color="gray.800">
                        {feature.title}
                      </Heading>
                      <Text color="gray.600" textAlign="center" fontSize="sm">
                        {feature.description}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Quick Browse Section */}
      <Box py={16} bg="white">
        <Container maxW="7xl">
          <VStack spacing={8}>
            <Heading textAlign="center" fontSize="3xl" color="gray.800">
              Popular Categories
            </Heading>
            
            <Suspense fallback={
              <Center p={8}>
                <Spinner size="xl" color="brand.500" />
              </Center>
            }>
              <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} spacing={4} w="full">
                {/* Category cards will be loaded here */}
                {['Electronics', 'Medical', 'Industrial', 'Agriculture', 'Textiles', 'Automotive'].map((category, index) => (
                  <Card
                    key={index}
                    textAlign="center"
                    p={4}
                    cursor="pointer"
                    _hover={{ transform: 'scale(1.05)', shadow: 'md' }}
                    transition="all 0.2s"
                    as={RouterLink}
                    to={`/products?category=${category.toLowerCase()}`}
                  >
                    <CardBody>
                      <VStack spacing={2}>
                        <Box w={12} h={12} bg="brand.100" borderRadius="md" />
                        <Text fontSize="sm" fontWeight="semibold">
                          {category}
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </Suspense>
            
            <Button
              as={RouterLink}
              to="/products"
              colorScheme="brand"
              size="lg"
              variant="outline"
            >
              View All Categories
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={20} bgGradient="linear(to-r, gray.800, gray.900)" color="white">
        <Container maxW="7xl">
          <VStack spacing={8} textAlign="center">
            <Heading fontSize="4xl">
              Ready to Grow Your Business?
            </Heading>
            <Text fontSize="lg" opacity={0.9} maxW="2xl">
              Join thousands of verified sellers and buyers on India's most trusted
              B2B platform. Start your journey today.
            </Text>
            <HStack spacing={4} flexWrap="wrap" justify="center">
              <Button
                as={RouterLink}
                to="/vendor-auth"
                size="lg"
                colorScheme="brand"
                _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
              >
                Register as Vendor
              </Button>
              <Button
                as={RouterLink}
                to="/user-auth"
                size="lg"
                variant="outline"
                borderColor="white"
                color="white"
                _hover={{
                  bg: 'white',
                  color: 'gray.800',
                  transform: 'translateY(-2px)',
                }}
              >
                Register as Buyer
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default OptimizedHome;

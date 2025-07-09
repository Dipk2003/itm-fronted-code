import React from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  VStack,
  Text,
  Icon,
  Card,
  CardBody,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  FiTool,
  FiUser,
  FiMonitor,
  FiTruck,
  FiHome,
  FiPackage,
  FiDroplet,
  FiHeart,
  FiShoppingBag,
  FiMessageSquare,
} from 'react-icons/fi';
import { CATEGORIES } from '../../constants/categories';

const CategoriesSection = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');

  const iconMap = {
    'tool': FiTool,
    'user': FiUser, // For clothing & apparel
    'monitor': FiMonitor,
    'truck': FiTruck,
    'heart': FiHeart,
    'home': FiHome,
    'package': FiPackage,
    'shopping-bag': FiShoppingBag,
    'droplet': FiDroplet, // For chemicals
  };

  const categoriesWithIcons = CATEGORIES.map(category => ({
    ...category,
    icon: iconMap[category.icon] || FiPackage,
    path: `/products?category=${category.id}`,
  }));

  // Add chat option
  const allCategories = [
    ...categoriesWithIcons,
    {
      id: 'chat',
      name: 'Chat with us',
      icon: FiMessageSquare,
      color: 'indigo.500',
      path: '/contact',
    },
  ];

  // Split categories into two sections
  const topCategories = allCategories.slice(0, 4);
  const bottomCategories = allCategories.slice(4);

  return (
    <Box bg={bgColor} py={16}>
      <Container maxW="8xl">
        <VStack spacing={12}>
          {/* Browse by Category Section */}
          <Box>
            <VStack spacing={6} align="start" w="full">
              <Heading fontSize="2xl" color="gray.800">
                Browse by Category
              </Heading>
              <Box w="full">
                <VStack spacing={4}>
                  {/* Category Links */}
                  <VStack spacing={2} align="start" w="full">
                    {categoriesWithIcons.slice(0, 8).map((category) => (
                      <Text 
                        key={category.id}
                        fontSize="sm" 
                        color="blue.500" 
                        cursor="pointer" 
                        _hover={{ textDecoration: 'underline' }}
                        as={RouterLink}
                        to={category.path}
                      >
                        {category.name}
                      </Text>
                    ))}
                  </VStack>
                </VStack>
              </Box>
            </VStack>
          </Box>

          {/* Top Categories Section */}
          <Box w="full">
            <VStack spacing={8}>
              <Heading fontSize="2xl" color="gray.800" textAlign="center">
                Top Categories
              </Heading>
              
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8} w="full">
                {topCategories.map((category) => (
                  <Card
                    key={category.id}
                    as={RouterLink}
                    to={category.path}
                    cursor="pointer"
                    textAlign="center"
                    _hover={{
                      transform: 'translateY(-4px)',
                      shadow: 'lg',
                    }}
                    transition="all 0.3s ease"
                    bg="white"
                    border="1px"
                    borderColor="gray.200"
                  >
                    <CardBody p={6}>
                      <VStack spacing={4}>
                        <Box
                          w={12}
                          h={12}
                          bg={`${category.color.split('.')[0]}.50`}
                          borderRadius="lg"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Icon as={category.icon} w={6} h={6} color={category.color} />
                        </Box>
                        <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                          {category.name}
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>

              {/* Bottom Categories Grid */}
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8} w="full">
                {bottomCategories.map((category) => (
                  <Card
                    key={category.id}
                    as={RouterLink}
                    to={category.path}
                    cursor="pointer"
                    textAlign="center"
                    _hover={{
                      transform: 'translateY(-4px)',
                      shadow: 'lg',
                    }}
                    transition="all 0.3s ease"
                    bg="white"
                    border="1px"
                    borderColor="gray.200"
                  >
                    <CardBody p={6}>
                      <VStack spacing={4}>
                        <Box
                          w={12}
                          h={12}
                          bg={`${category.color.split('.')[0]}.50`}
                          borderRadius="lg"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Icon as={category.icon} w={6} h={6} color={category.color} />
                        </Box>
                        <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                          {category.name}
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default CategoriesSection;

import React from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  VStack,
  Text,
  Image,
  Button,
  Card,
  CardBody,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { formatCurrency, formatProductName } from '../../utils/helpers';

const FeaturedProducts = () => {
  const bgColor = useColorModeValue('white', 'gray.800');

  const products = [
    {
      id: 1,
      name: 'Automatic Filling Machine',
      image: '/api/placeholder/200/200',
      price: 'Quotation',
      category: 'Industrial Equipment',
      supplier: 'ABC Manufacturing',
      location: 'Mumbai, India',
    },
    {
      id: 2,
      name: "Men's Denim Jeans",
      image: '/api/placeholder/200/200',
      price: 'Quotation',
      category: 'Clothing & Apparel',
      supplier: 'Fashion Hub',
      location: 'Delhi, India',
    },
    {
      id: 3,
      name: 'Smartphone with Triple Camera',
      image: '/api/placeholder/200/200',
      price: 'Quotation',
      category: 'Electronics',
      supplier: 'Tech Solutions',
      location: 'Bangalore, India',
    },
    {
      id: 4,
      name: 'Fresh Red Apples',
      image: '/api/placeholder/200/200',
      price: 'Quotation',
      category: 'Agricultural Products',
      supplier: 'Farm Fresh',
      location: 'Pune, India',
    },
  ];

  return (
    <Box bg={bgColor} py={16}>
      <Container maxW="8xl">
        <VStack spacing={8}>
          <Heading fontSize="2xl" color="gray.800" textAlign="center">
            Featured Products
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} w="full">
            {products.map((product) => (
              <Card
                key={product.id}
                as={RouterLink}
                to={`/product/${product.id}`}
                cursor="pointer"
                _hover={{
                  transform: 'translateY(-4px)',
                  shadow: 'lg',
                }}
                transition="all 0.3s ease"
                bg="white"
                border="1px"
                borderColor="gray.200"
                overflow="hidden"
              >
                <Box position="relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    w="full"
                    h="200px"
                    objectFit="cover"
                    bg="gray.100"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="gray.400"
                    fontSize="sm"
                  />
                  <Badge
                    position="absolute"
                    top={2}
                    right={2}
                    colorScheme="blue"
                    fontSize="xs"
                  >
                    Featured
                  </Badge>
                </Box>
                <CardBody p={4}>
                  <VStack spacing={3} align="start">
                    <Text fontSize="sm" fontWeight="semibold" color="gray.800" noOfLines={2}>
                      {formatProductName(product.name, 30)}
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color="green.600">
                      {formatCurrency(product.price)}
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      {product.supplier}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {product.location}
                    </Text>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      w="full"
                      mt={2}
                    >
                      Get Quote
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default FeaturedProducts;

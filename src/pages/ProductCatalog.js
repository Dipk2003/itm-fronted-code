import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Badge,
  Button,
  VStack,
  HStack,
  Input,
  Select,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { apiService } from '../services/api';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsResponse, categoriesResponse] = await Promise.all([
        apiService.products.getAll(),
        apiService.categories.getAll()
      ]);
      setProducts(productsResponse.data);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category?.id.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Center minH="50vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.500" />
          <Text>Loading products...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box py={10}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          <VStack spacing={4} textAlign="center">
            <Heading fontSize="4xl" color="gray.800">
              Product Catalog
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Discover quality products from verified sellers across India
            </Text>
          </VStack>

          {/* Search and Filter */}
          <HStack spacing={4} flexWrap="wrap">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              maxW="400px"
            />
            <Select
              placeholder="All Categories"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              maxW="200px"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
            </Select>
          </HStack>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <Center py={20}>
              <VStack spacing={4}>
                <Text fontSize="lg" color="gray.500">
                  No products found
                </Text>
                <Text fontSize="sm" color="gray.400">
                  Try adjusting your search criteria
                </Text>
              </VStack>
            </Center>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
              {filteredProducts.map(product => (
                <Card key={product.id} overflow="hidden" _hover={{ shadow: 'lg' }}>
                  <Image
                    src="https://via.placeholder.com/300x200?text=Product+Image"
                    alt={product.name}
                    h="200px"
                    w="full"
                    objectFit="cover"
                  />
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <VStack spacing={1} align="start">
                        <Heading size="sm" noOfLines={2}>
                          {product.name}
                        </Heading>
                        <Text fontSize="sm" color="gray.600" noOfLines={2}>
                          {product.description}
                        </Text>
                      </VStack>
                      
                      <HStack justify="space-between">
                        <Text fontWeight="bold" color="green.500" fontSize="lg">
                          ₹{product.price?.toLocaleString() || 'N/A'}
                        </Text>
                        <Badge colorScheme={product.stock > 0 ? 'green' : 'red'}>
                          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </HStack>
                      
                      <Badge colorScheme="purple" size="sm" alignSelf="start">
                        {product.category?.name || 'Uncategorized'}
                      </Badge>
                      
                      <Button
                        as={RouterLink}
                        to={`/product/${product.id}`}
                        colorScheme="brand"
                        size="sm"
                        w="full"
                      >
                        View Details
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default ProductCatalog;

import React, { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Heading,
  Button,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Image,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useDisclosure,
  useToast,
  Icon,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Center
} from '@chakra-ui/react';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiMoreVertical,
  FiPackage,
  FiDollarSign,
  FiBox,
  FiEye
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import vendorService from '../../services/vendorService';

const ProductManagement = () => {
  const { user } = useAuth();
  const taxProfile = { verified: true }; // Placeholder
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: ''
  });
  const [errors, setErrors] = useState({});
  const [editingProduct, setEditingProduct] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        vendorService.getVendorProducts(user.id),
        vendorService.getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      toast({
        title: "Error loading data",
        description: "Could not fetch products and categories",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: ''
    });
    setErrors({});
    onOpen();
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.category.id
    });
    setErrors({});
    onOpen();
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!productForm.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!productForm.description.trim()) {
      newErrors.description = 'Product description is required';
    }
    
    if (productForm.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (productForm.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }
    
    if (!productForm.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitProduct = async () => {
    if (!validateForm()) return;

    setFormLoading(true);
    try {
      const productData = {
        ...productForm,
        vendorId: user.id
      };

      if (editingProduct) {
        // Update existing product (would need update endpoint)
        toast({
          title: "Feature Coming Soon",
          description: "Product update functionality will be available soon",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Add new product
        const newProduct = await vendorService.addProduct(productData);
        setProducts(prev => [...prev, newProduct]);
        
        toast({
          title: "Product Added Successfully!",
          description: "Your product has been listed successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not save product. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    // Would need delete endpoint
    toast({
      title: "Feature Coming Soon",
      description: "Product deletion functionality will be available soon",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleInputChange = (field, value) => {
    setProductForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  if (!taxProfile) {
    return (
      <Alert status="warning" borderRadius="lg">
        <AlertIcon />
        <Box>
          <AlertTitle>Profile Setup Required!</AlertTitle>
          <AlertDescription>
            Please complete your business profile setup before listing products.
          </AlertDescription>
        </Box>
      </Alert>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between" align="center">
        <Box>
          <Heading size="md">📦 Product Management</Heading>
          <Text color="gray.600">Manage your product listings</Text>
        </Box>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="teal"
          onClick={handleAddProduct}
        >
          Add New Product
        </Button>
      </HStack>

      {loading ? (
        <Center py={20}>
          <VStack spacing={4}>
            <Spinner size="xl" color="teal.500" />
            <Text>Loading products...</Text>
          </VStack>
        </Center>
      ) : products.length === 0 ? (
        <Card>
          <CardBody>
            <VStack spacing={4} py={10}>
              <Icon as={FiPackage} boxSize={12} color="gray.400" />
              <VStack spacing={2} textAlign="center">
                <Heading size="md" color="gray.600">No Products Listed</Heading>
                <Text color="gray.500">
                  Start by adding your first product to begin selling
                </Text>
              </VStack>
              <Button
                leftIcon={<FiPlus />}
                colorScheme="teal"
                onClick={handleAddProduct}
              >
                Add Your First Product
              </Button>
            </VStack>
          </CardBody>
        </Card>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {products.map((product) => (
            <Card key={product.id} overflow="hidden">
              <Box position="relative">
                <Image
                  src="https://via.placeholder.com/300x200?text=Product+Image"
                  alt={product.name}
                  h="200px"
                  w="full"
                  objectFit="cover"
                />
                <Badge
                  position="absolute"
                  top={2}
                  right={2}
                  colorScheme={product.stock > 0 ? "green" : "red"}
                >
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </Badge>
              </Box>
              
              <CardBody>
                <VStack spacing={3} align="stretch">
                  <Box>
                    <Heading size="sm" noOfLines={2}>
                      {product.name}
                    </Heading>
                    <Text fontSize="sm" color="gray.600" noOfLines={2}>
                      {product.description}
                    </Text>
                  </Box>
                  
                  <HStack justify="space-between">
                    <VStack spacing={1} align="start">
                      <HStack>
                        <Icon as={FiDollarSign} color="green.500" />
                        <Text fontWeight="bold" color="green.500">
                          ₹{product.price.toLocaleString()}
                        </Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiBox} color="blue.500" />
                        <Text fontSize="sm" color="blue.500">
                          Stock: {product.stock}
                        </Text>
                      </HStack>
                    </VStack>
                    
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<FiMoreVertical />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem
                          icon={<FiEye />}
                          onClick={() => {
                            toast({
                              title: "Feature Coming Soon",
                              description: "Product preview will be available soon",
                              status: "info",
                              duration: 3000,
                              isClosable: true,
                            });
                          }}
                        >
                          View Details
                        </MenuItem>
                        <MenuItem
                          icon={<FiEdit />}
                          onClick={() => handleEditProduct(product)}
                        >
                          Edit Product
                        </MenuItem>
                        <MenuItem
                          icon={<FiTrash2 />}
                          color="red.500"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Delete Product
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </HStack>
                  
                  <Badge
                    colorScheme="purple"
                    size="sm"
                    alignSelf="start"
                  >
                    {product.category?.name || 'Uncategorized'}
                  </Badge>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}

      {/* Add/Edit Product Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isInvalid={errors.name} isRequired>
                <FormLabel>Product Name</FormLabel>
                <Input
                  placeholder="Enter product name"
                  value={productForm.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.description} isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  placeholder="Enter product description"
                  value={productForm.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                />
                <FormErrorMessage>{errors.description}</FormErrorMessage>
              </FormControl>

              <HStack spacing={4} w="full">
                <FormControl isInvalid={errors.price} isRequired>
                  <FormLabel>Price (₹)</FormLabel>
                  <NumberInput
                    value={productForm.price}
                    onChange={(value) => handleInputChange('price', parseFloat(value) || 0)}
                    min={0}
                    precision={2}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormErrorMessage>{errors.price}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.stock} isRequired>
                  <FormLabel>Stock Quantity</FormLabel>
                  <NumberInput
                    value={productForm.stock}
                    onChange={(value) => handleInputChange('stock', parseInt(value) || 0)}
                    min={0}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormErrorMessage>{errors.stock}</FormErrorMessage>
                </FormControl>
              </HStack>

              <FormControl isInvalid={errors.categoryId} isRequired>
                <FormLabel>Category</FormLabel>
                <Select
                  placeholder="Select category"
                  value={productForm.categoryId}
                  onChange={(e) => handleInputChange('categoryId', e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.categoryId}</FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="teal"
              onClick={handleSubmitProduct}
              isLoading={formLoading}
              loadingText={editingProduct ? "Updating..." : "Adding..."}
            >
              {editingProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default ProductManagement;

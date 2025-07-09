import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Select,
  InputGroup,
  Input,
  InputRightElement,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';

const HeroSection = () => {
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box bg={bgColor} py={16}>
      <Container maxW="8xl">
        <VStack spacing={8} textAlign="center">
          {/* Main Heading */}
          <VStack spacing={4}>
            <Heading
              fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
              fontWeight="bold"
              color="gray.800"
              lineHeight="shorter"
            >
              Connect with Verified Suppliers
            </Heading>
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              color="gray.600"
              maxW="600px"
            >
              Find quality products at the best prices
            </Text>
          </VStack>

          {/* Search Section */}
          <Box w="full" maxW="800px">
            <HStack spacing={0} bg="white" borderRadius="md" border="1px" borderColor="gray.300" overflow="hidden">
              {/* Category Dropdown */}
              <Select
                placeholder="All Categories"
                border="none"
                w="200px"
                bg="white"
                _focus={{ boxShadow: 'none' }}
              >
                <option value="electronics">Electronics</option>
                <option value="industrial">Industrial Equipment</option>
                <option value="clothing">Clothing & Apparel</option>
                <option value="consumer">Consumer Electronics</option>
                <option value="agricultural">Agricultural Products</option>
                <option value="medical">Medical Supplies</option>
                <option value="home">Home & Furniture</option>
                <option value="building">Building Materials</option>
                <option value="food">Food & Beverages</option>
                <option value="packaging">Packaging Supplies</option>
                <option value="chemicals">Chemicals</option>
              </Select>

              {/* Search Input */}
              <InputGroup flex={1}>
                <Input
                  placeholder="Search for products"
                  border="none"
                  borderLeft="1px"
                  borderColor="gray.300"
                  borderRadius="none"
                  _focus={{ boxShadow: 'none' }}
                />
                <InputRightElement w="60px">
                  <Button
                    bg="blue.500"
                    color="white"
                    _hover={{ bg: 'blue.600' }}
                    borderRadius="md"
                    size="sm"
                    w="full"
                    h="full"
                  >
                    <Icon as={FiSearch} />
                  </Button>
                </InputRightElement>
              </InputGroup>
            </HStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default HeroSection;

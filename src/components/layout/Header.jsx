import React, { useState } from 'react';
import {
  Box,
  Flex,
  HStack,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Icon,
  Text,
  Container,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiChevronDown } from 'react-icons/fi';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box bg={bgColor} borderBottom="1px" borderColor={borderColor} shadow="sm">
      <Container maxW="8xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          {/* Logo */}
          <Flex alignItems="center" as={RouterLink} to="/">
            <Box
              w={8}
              h={8}
              bg="blue.500"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mr={3}
            >
              <Text color="white" fontWeight="bold" fontSize="sm">
                IT
              </Text>
            </Box>
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              Indian Trade Mart
            </Text>
          </Flex>

          {/* Search Bar */}
          <Box flex={1} maxW="500px" mx={8}>
            <InputGroup>
              <Input
                placeholder="Search for products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                bg="gray.50"
                border="1px"
                borderColor="gray.300"
                _focus={{
                  borderColor: 'blue.500',
                  bg: 'white',
                }}
              />
              <InputRightElement>
                <Button
                  size="sm"
                  bg="blue.500"
                  color="white"
                  _hover={{ bg: 'blue.600' }}
                  onClick={handleSearch}
                  p={2}
                >
                  <Icon as={FiSearch} />
                </Button>
              </InputRightElement>
            </InputGroup>
          </Box>

          {/* Navigation */}
          <HStack spacing={4}>
            <Button
              variant="ghost"
              color="gray.600"
              _hover={{ color: 'blue.500' }}
            >
              Sign In
            </Button>
            <Button
              bg="blue.500"
              color="white"
              _hover={{ bg: 'blue.600' }}
              as={RouterLink}
              to="/vendor-auth"
            >
              Join Free
            </Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;

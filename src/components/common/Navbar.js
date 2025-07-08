import React from 'react';
import {
  Box,
  Flex,
  HStack,
  VStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
  Avatar,
  Badge,
  Container,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, isAuthenticated, logout, isAdmin, isVendor } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavLink = ({ children, to, ...props }) => (
    <Link
      as={RouterLink}
      to={to}
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      {...props}
    >
      {children}
    </Link>
  );

  const getVendorTypeBadge = (vendorType) => {
    const colors = {
      DIAMOND: 'purple',
      PLATINUM: 'blue',
      GOLD: 'yellow',
      BASIC: 'gray'
    };
    
    const icons = {
      DIAMOND: '💎',
      PLATINUM: '🥈',
      GOLD: '🥇',
      BASIC: '🏷️'
    };

    return (
      <Badge colorScheme={colors[vendorType] || 'gray'} size="sm">
        {icons[vendorType]} {vendorType || 'BASIC'}
      </Badge>
    );
  };

  return (
    <Box bg={useColorModeValue('white', 'gray.900')} px={4} shadow="sm" borderBottom="1px" borderColor="gray.200">
      <Container maxW="7xl">
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          
          <HStack spacing={8} alignItems={'center'}>
            <Box>
              <Text
                as={RouterLink}
                to="/"
                fontSize="xl"
                fontWeight="bold"
                color="brand.500"
                _hover={{ textDecoration: 'none' }}
              >
                🏢 Indian Trade Mart
              </Text>
            </Box>
            
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/products">Products</NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </HStack>
          </HStack>

          <Flex alignItems={'center'}>
            {isAuthenticated() ? (
              <HStack spacing={4}>
                {/* Notification or other icons can go here */}
                
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={'full'}
                    variant={'link'}
                    cursor={'pointer'}
                    minW={0}
                  >
                    <HStack spacing={2}>
                      <Avatar size="sm" name={user?.name || user?.email} />
                      <VStack spacing={0} align="start" display={{ base: 'none', md: 'flex' }}>
                        <Text fontSize="sm" fontWeight="medium">
                          {user?.name || 'User'}
                        </Text>
                        <HStack spacing={2}>
                          <Text fontSize="xs" color="gray.500">
                            {user?.email}
                          </Text>
                          {isVendor() && getVendorTypeBadge(user?.vendorType)}
                        </HStack>
                      </VStack>
                      <ChevronDownIcon />
                    </HStack>
                  </MenuButton>
                  
                  <MenuList>
                    <MenuItem fontSize="sm" fontWeight="medium">
                      {user?.name || user?.email}
                    </MenuItem>
                    <MenuItem fontSize="xs" color="gray.500">
                      {user?.email}
                    </MenuItem>
                    
                    <MenuDivider />
                    
                    {isVendor() && (
                      <MenuItem as={RouterLink} to="/vendor-dashboard">
                        📊 Vendor Dashboard
                      </MenuItem>
                    )}
                    
                    {isAdmin() && (
                      <MenuItem as={RouterLink} to="/admin-dashboard">
                        🛡️ Admin Dashboard
                      </MenuItem>
                    )}
                    
                    <MenuItem>⚙️ Settings</MenuItem>
                    <MenuItem>📋 Profile</MenuItem>
                    
                    <MenuDivider />
                    
                    <MenuItem onClick={handleLogout} color="red.500">
                      🚪 Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            ) : (
              <HStack spacing={4}>
                <Button
                  as={RouterLink}
                  to="/login"
                  variant="ghost"
                  size="sm"
                >
                  Login
                </Button>
                <Button
                  as={RouterLink}
                  to="/register"
                  colorScheme="brand"
                  size="sm"
                >
                  Register
                </Button>
              </HStack>
            )}
          </Flex>
        </Flex>

        {/* Mobile menu */}
        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              <NavLink to="/" onClick={onClose}>Home</NavLink>
              <NavLink to="/products" onClick={onClose}>Products</NavLink>
              <NavLink to="/about" onClick={onClose}>About</NavLink>
              <NavLink to="/contact" onClick={onClose}>Contact</NavLink>
              
              {isAuthenticated() && (
                <>
                  {isVendor() && (
                    <NavLink to="/vendor-dashboard" onClick={onClose}>
                      📊 Vendor Dashboard
                    </NavLink>
                  )}
                  
                  {isAdmin() && (
                    <NavLink to="/admin-dashboard" onClick={onClose}>
                      🛡️ Admin Dashboard
                    </NavLink>
                  )}
                  
                  <Button
                    onClick={() => {
                      handleLogout();
                      onClose();
                    }}
                    variant="ghost"
                    size="sm"
                    color="red.500"
                    justifyContent="flex-start"
                  >
                    🚪 Logout
                  </Button>
                </>
              )}
              
              {!isAuthenticated() && (
                <>
                  <NavLink to="/login" onClick={onClose}>Login</NavLink>
                  <NavLink to="/register" onClick={onClose}>Register</NavLink>
                </>
              )}
            </Stack>
          </Box>
        ) : null}
      </Container>
    </Box>
  );
};

export default Navbar;

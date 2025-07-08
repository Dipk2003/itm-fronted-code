import React from 'react';
import {
  Box,
  Card,
  CardBody,
  Image,
  Text,
  Heading,
  HStack,
  VStack,
  Badge,
  Button,
  Icon,
  useColorModeValue,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { FiStar, FiShoppingCart, FiHeart } from 'react-icons/fi';

const ProductCard = ({ product, onAddToCart, onToggleFavorite, isFavorite = false }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardHover = useColorModeValue('gray.50', 'gray.700');

  return (
    <Card
      bg={cardBg}
      shadow="md"
      borderRadius="lg"
      overflow="hidden"
      _hover={{
        bg: cardHover,
        shadow: 'lg',
        transform: 'translateY(-2px)',
      }}
      transition="all 0.2s"
      cursor="pointer"
    >
      <Box position="relative">
        <Image
          src={product.image || '/api/placeholder/300/200'}
          alt={product.name}
          height="200px"
          width="100%"
          objectFit="cover"
        />
        <Button
          position="absolute"
          top={2}
          right={2}
          size="sm"
          variant="ghost"
          colorScheme={isFavorite ? 'red' : 'gray'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(product.id);
          }}
        >
          <Icon as={FiHeart} fill={isFavorite ? 'red.500' : 'none'} />
        </Button>
      </Box>

      <CardBody p={4}>
        <VStack align="stretch" spacing={3}>
          <VStack align="stretch" spacing={1}>
            <Heading size="sm" noOfLines={2}>
              {product.name}
            </Heading>
            <Text fontSize="sm" color="gray.600" noOfLines={1}>
              by {product.vendor}
            </Text>
          </VStack>

          <Flex align="center">
            <HStack spacing={1}>
              <Icon as={FiStar} color="yellow.400" />
              <Text fontSize="sm" fontWeight="medium">
                {product.rating || 4.0}
              </Text>
            </HStack>
            <Spacer />
            <Text fontSize="lg" fontWeight="bold" color="brand.500">
              {product.price}
            </Text>
          </Flex>

          <Button
            leftIcon={<Icon as={FiShoppingCart} />}
            colorScheme="brand"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(product);
            }}
          >
            Add to Cart
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default ProductCard;

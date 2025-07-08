import React from 'react';
import {
  Box,
  Container,
  Text,
  Stack,
  Link,
  SimpleGrid,
  Heading,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => (
  <Box bg="gray.800" color="gray.200" py={10} width="full" as="footer">
    <Container maxW="7xl">
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
        <Stack align={"start"} spacing={4}>
          <Heading fontSize="lg" color="white">
            📦 Indian Trade Mart
          </Heading>
          <Text fontSize="sm" color="gray.400">
            Connecting sellers with verified buyers and increasing the sales
            channels.
          </Text>
        </Stack>

        <Stack align="start">
          <Heading fontSize="md" color="white">
            Quick Links
          </Heading>
          <Link href="/products" _hover={{ textDecoration: "underline" }}>
            Products
          </Link>
          <Link href="/about" _hover={{ textDecoration: "underline" }}>
            About Us
          </Link>
          <Link href="/contact" _hover={{ textDecoration: "underline" }}>
            Contact Us
          </Link>
          <Link href="/login" _hover={{ textDecoration: "underline" }}>
            Login
          </Link>
          <Link href="/register" _hover={{ textDecoration: "underline" }}>
            Register
          </Link>
        </Stack>

        <Stack align={"start"}>
          <Heading fontSize="md" color="white">
            Stay Connected
          </Heading>
          <HStack spacing={3}>
            <IconButton
              as="a"
              href="https://facebook.com"
              aria-label="Facebook"
              icon={<FaFacebook />}
              variant="ghost"
              size="lg"
              colorScheme="facebook"
            />
            <IconButton
              as="a"
              href="https://twitter.com"
              aria-label="Twitter"
              icon={<FaTwitter />}
              variant="ghost"
              size="lg"
              colorScheme="twitter"
            />
            <IconButton
              as="a"
              href="https://instagram.com"
              aria-label="Instagram"
              icon={<FaInstagram />}
              variant="ghost"
              size="lg"
              colorScheme="pink"
            />
            <IconButton
              as="a"
              href="https://linkedin.com"
              aria-label="LinkedIn"
              icon={<FaLinkedin />}
              variant="ghost"
              size="lg"
              colorScheme="linkedin"
            />
          </HStack>
        </Stack>
      </SimpleGrid>

      <Box textAlign="center" pt={10} fontSize="sm" color="gray.500">
        © {new Date().getFullYear()} Indian Trade Mart. All rights reserved.
      </Box>
    </Container>
  </Box>
);

export default Footer;


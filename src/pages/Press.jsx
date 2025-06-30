import React from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Button,
  Container,
  useColorModeValue,
  Image,
  Link,
} from '@chakra-ui/react';
import Footer from '../component/Footer';
import Navbar from '../component/Navbar';

const Press = () => {
  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.700');

  const logos = [
    {
      name: 'Light Logo',
      src: 'https://via.placeholder.com/150?text=Light+Logo',
      download: '/assets/logo-light.png',
    },
    {
      name: 'Dark Logo',
      src: 'https://via.placeholder.com/150?text=Dark+Logo',
      download: '/assets/logo-dark.png',
    },
  ];

  const releases = [
    {
      title: 'indiatrademart Launches AI-Powered Buyer-Seller Matching',
      date: 'May 22, 2025',
      link: '#',
    },
    {
      title: 'indiatrademart Crosses 75 Lakh Active Buyers',
      date: 'April 10, 2025',
      link: '#',
    },
    {
      title: 'New indiatrademart Platform Features Introduced in 2025 Update',
      date: 'March 1, 2025',
      link: '#',
    },
  ];

  return (
    <>
    <Navbar/>
    <Box bg={bg} py={10} minH="100vh">
      <Container maxW="7xl">
        {/* Page Heading */}
        <VStack spacing={4} textAlign="center" mb={10}>
          <Heading fontSize="4xl">Press & Media</Heading>
          <Text fontSize="lg" color="gray.600" maxW="3xl">
            Welcome to our media resource hub. Download official assets, explore our press releases, and get in touch for media inquiries.
          </Text>
        </VStack>

        {/* Logo Assets Section */}
        <Box mb={12}>
          <Heading size="lg" mb={6}>
            Logo Downloads
          </Heading>
          <SimpleGrid columns={[1, 2]} spacing={8}>
            {logos.map((logo, index) => (
              <Box key={index} bg={cardBg} p={6} borderRadius="md" textAlign="center" shadow="md">
                <Image src={logo.src} alt={logo.name} mb={4} mx="auto" />
                <Text mb={2} fontWeight="semibold">{logo.name}</Text>
                <Button as="a" href={logo.download} download colorScheme="blue">
                  Download
                </Button>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* Press Releases */}
        <Box mb={12}>
          <Heading size="lg" mb={6}>
            Latest Press Releases
          </Heading>
          <VStack align="start" spacing={4}>
            {releases.map((item, idx) => (
              <Box key={idx} p={4} bg={cardBg} borderRadius="md" shadow="sm" w="100%">
                <Text fontWeight="bold">{item.title}</Text>
                <Text fontSize="sm" color="gray.500" mb={2}>{item.date}</Text>
                <Link href={item.link} color="blue.500" fontWeight="medium">Read More</Link>
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Media Contact */}
        <Box textAlign="center" mt={10}>
          <Heading size="md" mb={2}>Media Inquiries</Heading>
          <Text color="gray.600">
            For interviews, quotes, and speaking engagements, please contact us at:
          </Text>
          <Text fontWeight="semibold" color="blue.500" mt={2}>
            media@IndiaTradeMartmart.in | +91-98765-43210
          </Text>
        </Box>
      </Container>
    </Box>
    <Footer/>
    </>
  );
};

export default Press;

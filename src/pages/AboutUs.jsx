import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  Image,
  SimpleGrid,
  Container,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';

const AboutUs = () => {
  return (
<>
<Navbar/>
    <Box bg={useColorModeValue('gray.50', 'gray.900')} py={10}>
      <Container maxW="7xl">
        <Stack spacing={10}>
          {/* Section 1 - Header */}
          <Box textAlign="center" mt={10}>
  <Heading fontSize="4xl">About Our Company</Heading>
  <Text mt={4} fontSize="lg" color="gray.600">
    We empower businesses by connecting buyers with verified suppliers across India through innovative technology.
  </Text>
</Box>


          {/* Section 2 - Image & Mission */}
          <Flex direction={['column', 'row']} gap={10} align="center">
            <Image
              src="https://img.freepik.com/free-vector/business-people-working-together-project_74855-6302.jpg"
              alt="Teamwork"
              boxSize={['100%', '50%']}
              borderRadius="md"
              objectFit="cover"
            />
            <Box>
              <Heading size="md" mb={4}>Our Mission</Heading>
              <Text color="gray.600">
                We aim to provide a seamless platform where businesses can trade easily, securely, and transparently. We believe in empowering small and medium enterprises with the same tools available to large corporations.
              </Text>
            </Box>
          </Flex>

          {/* Section 3 - Stats or Highlights */}
          <SimpleGrid columns={[1, 2, 4]} spacing={8} mt={10}>
            {[
              { label: '1 Crore+', value: 'Products' },
              { label: '75 Lakh+', value: 'Buyers' },
              { label: '60 Lakh+', value: 'Suppliers' },
              { label: '1000+', value: 'Categories' },
            ].map((stat, idx) => (
              <Box key={idx} bg="white" p={6} shadow="md" borderRadius="md" textAlign="center">
                <Heading size="lg" color="blue.500">{stat.label}</Heading>
                <Text mt={2} fontSize="md" color="gray.600">{stat.value}</Text>
              </Box>
            ))}
          </SimpleGrid>

          {/* Section 4 - Why Choose Us */}
          <Box mt={10}>
            <Heading fontSize="2xl" mb={4}>Why Choose Us</Heading>
            <SimpleGrid columns={[1, 2, 2]} spacing={6}>
              {[
                "Trusted B2B platform for over a decade",
                "Verified suppliers with real-time chat options",
                "Secure and transparent transactions",
                "PAN India reach with global exposure",
              ].map((point, idx) => (
                <Box key={idx} p={4} bg="white" shadow="sm" borderRadius="md">
                  <Text color="gray.700">• {point}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          <Divider my={6} />

          {/* Section 5 - Contact Info */}
          <Box textAlign="center">
            <Heading size="md">Want to connect with us?</Heading>
            <Text color="gray.600" mt={2}>
              Email: support@b2bmart.in | Phone: +91-99999-88888
            </Text>
          </Box>
        </Stack>
      </Container>
    </Box>
    <Footer/>
    </>
  );
 
};

export default AboutUs;

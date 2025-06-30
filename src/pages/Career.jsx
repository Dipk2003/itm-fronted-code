import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Button,
  Container,
  useColorModeValue,
} from '@chakra-ui/react';
import Footer from '../component/Footer';
import Navbar from '../component/Navbar';

const jobs = [
  {
    title: 'Frontend Developer',
    location: 'Remote / Noida',
    description: 'Build beautiful and performant user interfaces with React and Chakra UI.',
  },
  {
    title: 'Backend Developer',
    location: 'Remote / Bengaluru',
    description: 'Work on APIs and microservices using Node.js / Java / Spring Boot.',
  },
  {
    title: 'Marketing Executive',
    location: 'Mumbai / Remote',
    description: 'Handle B2B lead generation, email campaigns, and digital marketing.',
  },
];

const Career = () => {
  // ✅ move hooks outside the loop
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.700');

  return (
    <>
      <Navbar />
      <Box bg={bgColor} py={10} minH="100vh">
        <Container maxW="7xl">
          <VStack spacing={6} textAlign="center" mb={10}>
            <Heading fontSize="4xl" mt={10}>Careers at B2B Mart</Heading>
            <Text fontSize="lg" color="gray.600" maxW="3xl">
              We're always looking for passionate, driven, and curious individuals to join our mission of transforming B2B commerce in India.
            </Text>
          </VStack>

          <SimpleGrid columns={[1, 2, 3]} spacing={6}>
            {jobs.map((job, index) => (
              <Box
                key={index}
                p={6}
                bg={cardBg}
                borderRadius="md"
                shadow="md"
              >
                <Heading size="md" mb={2}>{job.title}</Heading>
                <Text fontSize="sm" color="gray.500">{job.location}</Text>
                <Text mt={3} mb={4} color="gray.600">{job.description}</Text>
                <Button colorScheme="blue" size="sm">Apply Now</Button>
              </Box>
            ))}
          </SimpleGrid>

          <Box textAlign="center" mt={10}>
            <Text>
              Don't see a role that fits? Send us your resume at{' '}
              <Text as="span" color="blue.500">careers@IndianTradeMartmart.in</Text>
            </Text>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default Career;

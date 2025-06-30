import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Input,
  Textarea,
  Button,
  Container,
  useColorModeValue,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';

const ContactUs = () => {
  return (
    <>
    <Navbar/>
    <Box bg={useColorModeValue('gray.50', 'gray.900')} py={10} minH="100vh">
      <Container maxW="7xl">
        <Heading textAlign="center" fontSize="4xl" mt={10}>
          Contact Us
        </Heading>

        <Text color="gray.600" textAlign="center" mb={10}>
          Have questions or business inquiries? Fill out the form below or reach us directly.
        </Text>

        <VStack spacing={6}>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input placeholder="Your Name" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" placeholder="you@example.com" />
          </FormControl>

          <FormControl>
            <FormLabel>Phone</FormLabel>
            <Input type="tel" placeholder="Phone Number" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Message</FormLabel>
            <Textarea placeholder="Your message here..." rows={5} />
          </FormControl>

          <Button colorScheme="blue" size="lg">
            Submit
          </Button>
        </VStack>

        <Box textAlign="center" mt={10}>
          <Text fontWeight="medium">
            Or reach us at: <br />
            <Text as="span" color="blue.500">contact@IndiaTradeMart.in</Text> | +91-99999-88888
          </Text>
        </Box>
      </Container>
    </Box>
    <Footer/>
    </>
  );
};

export default ContactUs;

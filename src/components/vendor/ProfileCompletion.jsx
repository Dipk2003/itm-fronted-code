import React, { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Badge,
  SimpleGrid,
  Radio,
  RadioGroup,
  Stack,
  useToast,
  Progress,
  Icon,
  Divider
} from '@chakra-ui/react';
import { FiCheckCircle, FiUser, FiFileText, FiShield } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import vendorService from '../../services/vendorService';

const ProfileCompletion = () => {
  const { user } = useAuth();
  const taxProfile = null; // Placeholder
  const setTaxProfile = () => {}; // Placeholder
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [panData, setPanData] = useState({
    pan: '',
    legalName: '',
    businessType: ''
  });
  const [gstOptions, setGstOptions] = useState([]);
  const [selectedGst, setSelectedGst] = useState('');
  const [errors, setErrors] = useState({});
  const toast = useToast();

  useEffect(() => {
    if (taxProfile && taxProfile.panNumber) {
      setStep(3); // Profile already completed
    }
  }, [taxProfile]);

  // Step 1: PAN Entry and Verification
  const handlePanVerification = async () => {
    if (!validatePanForm()) return;

    setLoading(true);
    try {
      // Use mock PAN verification for demo
      const gstData = await vendorService.mockPanVerification(panData.pan);
      setGstOptions(gstData.gstNumbers);
      setPanData(prev => ({
        ...prev,
        legalName: gstData.legalName,
        businessType: gstData.businessType
      }));
      setStep(2);
      
      toast({
        title: "PAN Verified Successfully!",
        description: `Found ${gstData.gstNumbers.length} GST registrations`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "PAN Verification Failed",
        description: "Please check your PAN number and try again",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: GST Selection and Profile Completion
  const handleProfileCompletion = async () => {
    if (!selectedGst) {
      toast({
        title: "Please select a GST number",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const profileData = await vendorService.verifyPanAndGst(user.id, {
        pan: panData.pan,
        gst: selectedGst,
        legalName: panData.legalName
      });

      setTaxProfile(profileData);
      setStep(3);
      
      toast({
        title: "Profile Completed Successfully!",
        description: "You can now start listing products and accessing all features",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Profile Completion Failed",
        description: "Please try again or contact support",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const validatePanForm = () => {
    const newErrors = {};
    
    if (!panData.pan.trim()) {
      newErrors.pan = 'PAN number is required';
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panData.pan)) {
      newErrors.pan = 'Please enter a valid PAN number (e.g., ABCDE1234F)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setPanData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const getProgressValue = () => {
    if (step === 1) return 33;
    if (step === 2) return 66;
    return 100;
  };

  return (
    <VStack spacing={8} align="stretch">
      <Box>
        <Heading size="md" mb={2}>👤 Complete Your Business Profile</Heading>
        <Text color="gray.600" mb={4}>
          Complete your business verification to unlock all vendor features
        </Text>
        
        <Progress 
          value={getProgressValue()} 
          colorScheme="teal" 
          size="lg" 
          borderRadius="full"
          mb={6}
        />
        
        <HStack spacing={8} justify="center">
          <HStack>
            <Icon 
              as={step >= 1 ? FiCheckCircle : FiUser} 
              color={step >= 1 ? "green.500" : "gray.400"} 
            />
            <Text 
              color={step >= 1 ? "green.500" : "gray.400"}
              fontWeight={step === 1 ? "bold" : "normal"}
            >
              PAN Verification
            </Text>
          </HStack>
          
          <HStack>
            <Icon 
              as={step >= 2 ? FiCheckCircle : FiFileText} 
              color={step >= 2 ? "green.500" : "gray.400"} 
            />
            <Text 
              color={step >= 2 ? "green.500" : "gray.400"}
              fontWeight={step === 2 ? "bold" : "normal"}
            >
              GST Selection
            </Text>
          </HStack>
          
          <HStack>
            <Icon 
              as={step >= 3 ? FiCheckCircle : FiShield} 
              color={step >= 3 ? "green.500" : "gray.400"} 
            />
            <Text 
              color={step >= 3 ? "green.500" : "gray.400"}
              fontWeight={step === 3 ? "bold" : "normal"}
            >
              Profile Complete
            </Text>
          </HStack>
        </HStack>
      </Box>

      {/* Step 1: PAN Verification */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <Heading size="sm">🔍 Step 1: PAN Verification</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Alert status="info" borderRadius="lg">
                <AlertIcon />
                <Box>
                  <AlertTitle>PAN Verification Required</AlertTitle>
                  <AlertDescription>
                    We need to verify your PAN to fetch your GST registrations and complete your business profile.
                  </AlertDescription>
                </Box>
              </Alert>

              <FormControl isInvalid={errors.pan} isRequired>
                <FormLabel>PAN Number</FormLabel>
                <Input
                  placeholder="Enter your PAN number (e.g., ABCDE1234F)"
                  value={panData.pan}
                  onChange={(e) => handleInputChange('pan', e.target.value.toUpperCase())}
                  maxLength={10}
                  fontSize="lg"
                  letterSpacing="wider"
                />
                <FormErrorMessage>{errors.pan}</FormErrorMessage>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Enter your 10-digit PAN number as printed on your PAN card
                </Text>
              </FormControl>

              <Button
                colorScheme="teal"
                size="lg"
                onClick={handlePanVerification}
                isLoading={loading}
                loadingText="Verifying PAN..."
                leftIcon={<FiFileText />}
              >
                Verify PAN & Fetch GST Details
              </Button>
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Step 2: GST Selection */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <Heading size="sm">📋 Step 2: Select GST Registration</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Alert status="success" borderRadius="lg">
                <AlertIcon />
                <Box>
                  <AlertTitle>PAN Verified Successfully!</AlertTitle>
                  <AlertDescription>
                    Found {gstOptions.length} GST registrations. Please select the one you want to use for trading.
                  </AlertDescription>
                </Box>
              </Alert>

              <Box>
                <Text fontWeight="bold" mb={2}>Business Details:</Text>
                <SimpleGrid columns={2} spacing={4}>
                  <Text><strong>Legal Name:</strong> {panData.legalName}</Text>
                  <Text><strong>Business Type:</strong> {panData.businessType}</Text>
                </SimpleGrid>
              </Box>

              <Divider />

              <Box>
                <Text fontWeight="bold" mb={4}>Select GST Registration:</Text>
                <RadioGroup value={selectedGst} onChange={setSelectedGst}>
                  <Stack spacing={4}>
                    {gstOptions.map((gst, index) => (
                      <Card key={index} variant="outline" cursor="pointer">
                        <CardBody>
                          <HStack spacing={4}>
                            <Radio value={gst.gstin} size="lg" />
                            <VStack align="start" spacing={1} flex={1}>
                              <HStack>
                                <Text fontWeight="bold">{gst.gstin}</Text>
                                <Badge 
                                  colorScheme={gst.status === 'Active' ? 'green' : 'red'} 
                                  size="sm"
                                >
                                  {gst.status}
                                </Badge>
                              </HStack>
                              <Text fontSize="sm" color="gray.600">{gst.businessName}</Text>
                              <Text fontSize="sm" color="gray.500">{gst.address}</Text>
                            </VStack>
                          </HStack>
                        </CardBody>
                      </Card>
                    ))}
                  </Stack>
                </RadioGroup>
              </Box>

              <HStack spacing={4}>
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  flex={1}
                >
                  Back
                </Button>
                <Button
                  colorScheme="teal"
                  onClick={handleProfileCompletion}
                  isLoading={loading}
                  loadingText="Completing Profile..."
                  leftIcon={<FiCheckCircle />}
                  flex={2}
                >
                  Complete Profile Setup
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Step 3: Profile Completed */}
      {step === 3 && (
        <Card>
          <CardBody>
            <VStack spacing={6} align="center">
              <Icon as={FiCheckCircle} color="green.500" boxSize={12} />
              
              <VStack spacing={2} textAlign="center">
                <Heading size="md" color="green.500">
                  🎉 Profile Completed Successfully!
                </Heading>
                <Text color="gray.600">
                  Your business profile is now complete and verified.
                </Text>
              </VStack>

              {taxProfile && (
                <Card variant="outline" w="full">
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <Text fontWeight="bold">Profile Details:</Text>
                      <SimpleGrid columns={2} spacing={4}>
                        <Text><strong>PAN:</strong> {taxProfile.panNumber}</Text>
                        <Text><strong>GST:</strong> {taxProfile.gstNumber}</Text>
                        <Text><strong>Legal Name:</strong> {taxProfile.legalName}</Text>
                        <Text><strong>Status:</strong> 
                          <Badge colorScheme="green" ml={2}>Verified</Badge>
                        </Text>
                      </SimpleGrid>
                    </VStack>
                  </CardBody>
                </Card>
              )}

              <Alert status="success" borderRadius="lg">
                <AlertIcon />
                <Box>
                  <AlertTitle>What's Next?</AlertTitle>
                  <AlertDescription>
                    You can now start listing your products, access lead management, and enjoy all vendor features!
                  </AlertDescription>
                </Box>
              </Alert>
            </VStack>
          </CardBody>
        </Card>
      )}
    </VStack>
  );
};

export default ProfileCompletion;

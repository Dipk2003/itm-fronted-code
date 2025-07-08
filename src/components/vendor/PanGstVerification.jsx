import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Spinner,
  Badge,
  Icon,
  InputGroup,
  InputRightElement,
  Tooltip,
  Card,
  CardBody,
  Divider,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import { 
  FiCheck, 
  FiX, 
  FiShield, 
  FiAlertCircle, 
  FiInfo,
  FiCreditCard,
  FiFileText 
} from 'react-icons/fi';
import panGstService from '../../services/panGstService';

const PanGstVerification = ({ 
  vendorId, 
  onVerificationComplete, 
  initialData = {},
  showAdvancedOptions = true 
}) => {
  const [formData, setFormData] = useState({
    panNumber: initialData.panNumber || '',
    gstNumber: initialData.gstNumber || '',
    legalName: initialData.legalName || '',
    businessType: initialData.businessType || ''
  });

  const [verificationStatus, setVerificationStatus] = useState({
    pan: { verified: false, loading: false, error: null },
    gst: { verified: false, loading: false, error: null },
    matching: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Auto-verify PAN format when it changes
    if (formData.panNumber.length === 10) {
      validatePanFormat();
    }
  }, [formData.panNumber]);

  useEffect(() => {
    // Auto-verify GST format when it changes
    if (formData.gstNumber.length === 15) {
      validateGstFormat();
    }
  }, [formData.gstNumber]);

  useEffect(() => {
    // Check if PAN and GST match
    if (formData.panNumber && formData.gstNumber) {
      const isMatching = panGstService.isPanGstMatching(formData.panNumber, formData.gstNumber);
      setVerificationStatus(prev => ({
        ...prev,
        matching: isMatching
      }));
    }
  }, [formData.panNumber, formData.gstNumber]);

  const validatePanFormat = () => {
    const isValid = panGstService.validatePanFormat(formData.panNumber);
    setVerificationStatus(prev => ({
      ...prev,
      pan: { ...prev.pan, verified: isValid, error: isValid ? null : 'Invalid PAN format' }
    }));
    return isValid;
  };

  const validateGstFormat = () => {
    const isValid = panGstService.validateGstFormat(formData.gstNumber);
    setVerificationStatus(prev => ({
      ...prev,
      gst: { ...prev.gst, verified: isValid, error: isValid ? null : 'Invalid GST format' }
    }));
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const upperValue = name === 'panNumber' || name === 'gstNumber' ? value.toUpperCase() : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: upperValue
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear verification status when user modifies input
    if (name === 'panNumber' || name === 'gstNumber') {
      setVerificationStatus(prev => ({
        ...prev,
        [name === 'panNumber' ? 'pan' : 'gst']: { verified: false, loading: false, error: null }
      }));
    }
  };

  const verifyPan = async () => {
    if (!formData.panNumber) return;

    setVerificationStatus(prev => ({
      ...prev,
      pan: { ...prev.pan, loading: true, error: null }
    }));

    try {
      const result = await panGstService.verifyPan(formData.panNumber);
      setVerificationStatus(prev => ({
        ...prev,
        pan: { verified: true, loading: false, error: null, data: result }
      }));
      toast({
        title: 'PAN Verified',
        description: 'PAN number is valid and verified',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      setVerificationStatus(prev => ({
        ...prev,
        pan: { verified: false, loading: false, error: error.message }
      }));
      toast({
        title: 'PAN Verification Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const verifyGst = async () => {
    if (!formData.gstNumber) return;

    setVerificationStatus(prev => ({
      ...prev,
      gst: { ...prev.gst, loading: true, error: null }
    }));

    try {
      const result = await panGstService.verifyGst(formData.gstNumber);
      setVerificationStatus(prev => ({
        ...prev,
        gst: { verified: true, loading: false, error: null, data: result }
      }));
      toast({
        title: 'GST Verified',
        description: 'GST number is valid and verified',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      setVerificationStatus(prev => ({
        ...prev,
        gst: { verified: false, loading: false, error: error.message }
      }));
      toast({
        title: 'GST Verification Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    const newErrors = {};
    if (!formData.panNumber) newErrors.panNumber = 'PAN number is required';
    if (!formData.gstNumber) newErrors.gstNumber = 'GST number is required';
    if (!formData.legalName) newErrors.legalName = 'Legal name is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!verificationStatus.pan.verified || !verificationStatus.gst.verified) {
      toast({
        title: 'Verification Required',
        description: 'Please verify both PAN and GST numbers before submitting',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await panGstService.verifyVendorTaxData({
        vendorId,
        ...formData
      });

      toast({
        title: 'Tax Information Saved',
        description: 'Your tax information has been verified and saved successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      if (onVerificationComplete) {
        onVerificationComplete(result);
      }
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVerificationIcon = (status) => {
    if (status.loading) return <Spinner size="sm" color="blue.500" />;
    if (status.verified) return <Icon as={FiCheck} color="green.500" />;
    if (status.error) return <Icon as={FiX} color="red.500" />;
    return <Icon as={FiAlertCircle} color="gray.400" />;
  };

  const getVerificationColor = (status) => {
    if (status.verified) return 'green';
    if (status.error) return 'red';
    return 'gray';
  };

  return (
    <Box w="full">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Icon as={FiShield} w={12} h={12} color="blue.500" mb={4} />
          <Text fontSize="xl" fontWeight="bold" mb={2}>
            Tax Information Verification
          </Text>
          <Text color="gray.600" fontSize="sm">
            Please provide your PAN and GST details for verification
          </Text>
        </Box>

        {/* PAN/GST Matching Status */}
        {formData.panNumber && formData.gstNumber && (
          <Alert 
            status={verificationStatus.matching ? 'success' : 'warning'}
            borderRadius="md"
          >
            <AlertIcon />
            <Box>
              <AlertTitle>
                {verificationStatus.matching ? 'PAN-GST Match ✓' : 'PAN-GST Mismatch ⚠️'}
              </AlertTitle>
              <AlertDescription>
                {verificationStatus.matching 
                  ? 'Your PAN and GST numbers are matching correctly'
                  : 'The PAN in your GST number does not match the provided PAN'
                }
              </AlertDescription>
            </Box>
          </Alert>
        )}

        {/* Main Form */}
        <Card>
          <CardBody>
            <VStack spacing={6}>
              {/* PAN Verification */}
              <FormControl isInvalid={errors.panNumber}>
                <FormLabel>
                  <HStack>
                    <Icon as={FiCreditCard} />
                    <Text>PAN Number</Text>
                  </HStack>
                </FormLabel>
                <InputGroup>
                  <Input
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleInputChange}
                    placeholder="Enter 10-character PAN (e.g., ABCDE1234F)"
                    maxLength={10}
                    textTransform="uppercase"
                  />
                  <InputRightElement width="4rem">
                    <Tooltip 
                      label={
                        verificationStatus.pan.verified ? 'PAN Verified' :
                        verificationStatus.pan.error ? verificationStatus.pan.error :
                        'Click to verify PAN'
                      }
                    >
                      <Button
                        size="sm"
                        onClick={verifyPan}
                        isDisabled={!formData.panNumber || formData.panNumber.length !== 10}
                        isLoading={verificationStatus.pan.loading}
                        colorScheme={getVerificationColor(verificationStatus.pan)}
                        variant="ghost"
                      >
                        {getVerificationIcon(verificationStatus.pan)}
                      </Button>
                    </Tooltip>
                  </InputRightElement>
                </InputGroup>
                {errors.panNumber && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.panNumber}
                  </Text>
                )}
                {verificationStatus.pan.error && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {verificationStatus.pan.error}
                  </Text>
                )}
              </FormControl>

              {/* GST Verification */}
              <FormControl isInvalid={errors.gstNumber}>
                <FormLabel>
                  <HStack>
                    <Icon as={FiFileText} />
                    <Text>GST Number</Text>
                  </HStack>
                </FormLabel>
                <InputGroup>
                  <Input
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleInputChange}
                    placeholder="Enter 15-character GST (e.g., 27ABCDE1234F1Z5)"
                    maxLength={15}
                    textTransform="uppercase"
                  />
                  <InputRightElement width="4rem">
                    <Tooltip 
                      label={
                        verificationStatus.gst.verified ? 'GST Verified' :
                        verificationStatus.gst.error ? verificationStatus.gst.error :
                        'Click to verify GST'
                      }
                    >
                      <Button
                        size="sm"
                        onClick={verifyGst}
                        isDisabled={!formData.gstNumber || formData.gstNumber.length !== 15}
                        isLoading={verificationStatus.gst.loading}
                        colorScheme={getVerificationColor(verificationStatus.gst)}
                        variant="ghost"
                      >
                        {getVerificationIcon(verificationStatus.gst)}
                      </Button>
                    </Tooltip>
                  </InputRightElement>
                </InputGroup>
                {errors.gstNumber && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.gstNumber}
                  </Text>
                )}
                {verificationStatus.gst.error && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {verificationStatus.gst.error}
                  </Text>
                )}
              </FormControl>

              <Divider />

              {/* Legal Name */}
              <FormControl isInvalid={errors.legalName}>
                <FormLabel>Legal Business Name</FormLabel>
                <Input
                  name="legalName"
                  value={formData.legalName}
                  onChange={handleInputChange}
                  placeholder="Enter legal business name as per GST registration"
                />
                {errors.legalName && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.legalName}
                  </Text>
                )}
              </FormControl>

              {/* Business Type */}
              <FormControl>
                <FormLabel>Business Type (Optional)</FormLabel>
                <Input
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  placeholder="e.g., Private Limited Company, Partnership, etc."
                />
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        {/* Verification Summary */}
        {showAdvancedOptions && (
          <Card>
            <CardBody>
              <Text fontWeight="bold" mb={4}>Verification Summary</Text>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <Stat textAlign="center">
                  <StatLabel>PAN Status</StatLabel>
                  <StatNumber>
                    <Badge 
                      colorScheme={verificationStatus.pan.verified ? 'green' : 'red'}
                      fontSize="md"
                    >
                      {verificationStatus.pan.verified ? 'Verified' : 'Pending'}
                    </Badge>
                  </StatNumber>
                  <StatHelpText>
                    {verificationStatus.pan.verified ? '✓ Valid PAN' : '⚠ Needs verification'}
                  </StatHelpText>
                </Stat>

                <Stat textAlign="center">
                  <StatLabel>GST Status</StatLabel>
                  <StatNumber>
                    <Badge 
                      colorScheme={verificationStatus.gst.verified ? 'green' : 'red'}
                      fontSize="md"
                    >
                      {verificationStatus.gst.verified ? 'Verified' : 'Pending'}
                    </Badge>
                  </StatNumber>
                  <StatHelpText>
                    {verificationStatus.gst.verified ? '✓ Valid GST' : '⚠ Needs verification'}
                  </StatHelpText>
                </Stat>

                <Stat textAlign="center">
                  <StatLabel>PAN-GST Match</StatLabel>
                  <StatNumber>
                    <Badge 
                      colorScheme={verificationStatus.matching ? 'green' : 'yellow'}
                      fontSize="md"
                    >
                      {verificationStatus.matching ? 'Matched' : 'Check Required'}
                    </Badge>
                  </StatNumber>
                  <StatHelpText>
                    {verificationStatus.matching ? '✓ Numbers match' : '⚠ Verify match'}
                  </StatHelpText>
                </Stat>
              </SimpleGrid>
            </CardBody>
          </Card>
        )}

        {/* Info Alert */}
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <Box fontSize="sm">
            <AlertTitle>Important Note:</AlertTitle>
            <AlertDescription>
              Your tax information will be used for compliance and transaction processing. 
              Please ensure all details are accurate as per your official documents.
            </AlertDescription>
          </Box>
        </Alert>

        {/* Submit Button */}
        <Button
          colorScheme="blue"
          size="lg"
          onClick={handleSubmit}
          isLoading={isSubmitting}
          loadingText="Saving..."
          isDisabled={!verificationStatus.pan.verified || !verificationStatus.gst.verified}
        >
          Save Tax Information
        </Button>
      </VStack>
    </Box>
  );
};

export default PanGstVerification;

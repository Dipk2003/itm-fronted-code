import React, { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Heading,
  Card,
  CardBody,
  CardHeader,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Icon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Center,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  Select
} from '@chakra-ui/react';
import {
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiCalendar,
  FiEye,
  FiMail,
  FiPhone,
  FiMessageSquare
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import vendorService from '../../services/vendorService';

const LeadManagement = () => {
  const { user } = useAuth();
  const vendorRanking = null; // Placeholder
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [followUpNote, setFollowUpNote] = useState('');
  const [leadStatus, setLeadStatus] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    loadLeads();
  }, [user]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const response = await vendorService.getVendorLeads(user.vendorId);
      setLeads(response.data);
    } catch (error) {
      toast({
        title: "Error loading leads",
        description: "Could not fetch leads data",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'New': 'blue',
      'Contacted': 'orange',
      'Qualified': 'purple',
      'Closed Won': 'green',
      'Closed Lost': 'red'
    };
    return colors[status] || 'gray';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'red',
      'Medium': 'orange',
      'Low': 'green'
    };
    return colors[priority] || 'gray';
  };

  const handleViewLead = (lead) => {
    setSelectedLead(lead);
    setFollowUpNote('');
    setLeadStatus(lead.status);
    onOpen();
  };

  const handleUpdateLead = async () => {
    if (!selectedLead) return;

    try {
      setLoading(true);
      
      // Update lead status if changed
      if (leadStatus !== selectedLead.status) {
        await vendorService.updateLeadStatus(selectedLead.id, leadStatus);
      }

      // Add follow-up note if provided
      if (followUpNote.trim()) {
        // Update the lead with new notes
        const updatedNotes = selectedLead.notes 
          ? `${selectedLead.notes}\n\n--- Follow-up (${new Date().toLocaleDateString()}) ---\n${followUpNote}`
          : followUpNote;
        
        await vendorService.updateLead(selectedLead.id, {
          ...selectedLead,
          notes: updatedNotes,
          status: leadStatus,
          lastContactDate: new Date().toISOString()
        });
      } else if (leadStatus !== selectedLead.status) {
        // Just update status
        await vendorService.updateLead(selectedLead.id, {
          ...selectedLead,
          status: leadStatus,
          lastContactDate: new Date().toISOString()
        });
      }

      toast({
        title: "Lead Updated",
        description: "Lead has been successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset form and close modal
      setFollowUpNote('');
      onClose();
      
      // Refresh leads data
      loadLeads();
      
    } catch (error) {
      console.error('Error updating lead:', error);
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Failed to update lead. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getLeadStats = () => {
    const totalLeads = leads.length;
    const newLeads = leads.filter(lead => lead.status === 'New').length;
    const qualifiedLeads = leads.filter(lead => lead.status === 'Qualified').length;
    const wonLeads = leads.filter(lead => lead.status === 'Closed Won').length;
    const totalValue = leads.reduce((sum, lead) => sum + lead.estimatedValue, 0);
    const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : 0;

    return {
      totalLeads,
      newLeads,
      qualifiedLeads,
      wonLeads,
      totalValue,
      conversionRate
    };
  };

  const stats = getLeadStats();

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="md">📈 Lead Management</Heading>
        <Text color="gray.600">Track and manage your sales leads</Text>
      </Box>

      {/* Lead Statistics */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={FiUsers} color="blue.500" />
                  <Text>Total Leads</Text>
                </HStack>
              </StatLabel>
              <StatNumber color="blue.500">{stats.totalLeads}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                {stats.newLeads} new this week
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={FiTrendingUp} color="green.500" />
                  <Text>Conversion Rate</Text>
                </HStack>
              </StatLabel>
              <StatNumber color="green.500">{stats.conversionRate}%</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                {stats.wonLeads} leads converted
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={FiDollarSign} color="purple.500" />
                  <Text>Pipeline Value</Text>
                </HStack>
              </StatLabel>
              <StatNumber color="purple.500">₹{stats.totalValue.toLocaleString()}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                Total estimated value
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={FiCalendar} color="orange.500" />
                  <Text>Qualified Leads</Text>
                </HStack>
              </StatLabel>
              <StatNumber color="orange.500">{stats.qualifiedLeads}</StatNumber>
              <StatHelpText>
                Ready for conversion
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <Heading size="sm">Recent Leads</Heading>
        </CardHeader>
        <CardBody>
          {loading ? (
            <Center py={10}>
              <VStack spacing={4}>
                <Spinner size="xl" color="teal.500" />
                <Text>Loading leads...</Text>
              </VStack>
            </Center>
          ) : leads.length === 0 ? (
            <Alert status="info" borderRadius="lg">
              <AlertIcon />
              <Box>
                <AlertTitle>No Leads Yet</AlertTitle>
                <AlertDescription>
                  Start listing products to generate leads from potential customers.
                </AlertDescription>
              </Box>
            </Alert>
          ) : (
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Customer</Th>
                    <Th>Product</Th>
                    <Th>Inquiry Date</Th>
                    <Th>Status</Th>
                    <Th>Priority</Th>
                    <Th>Est. Value</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {leads.map((lead) => (
                    <Tr key={lead.id}>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="medium">{lead.customerName}</Text>
                          <Text fontSize="sm" color="gray.600">{lead.email}</Text>
                        </VStack>
                      </Td>
                      <Td>
                        <Text>{lead.productName}</Text>
                      </Td>
                      <Td>
                        <Text>{new Date(lead.inquiryDate).toLocaleDateString()}</Text>
                      </Td>
                      <Td>
                        <Badge colorScheme={getStatusColor(lead.status)}>
                          {lead.status}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge colorScheme={getPriorityColor(lead.priority)} variant="outline">
                          {lead.priority}
                        </Badge>
                      </Td>
                      <Td>
                        <Text fontWeight="medium" color="green.600">
                          ₹{lead.estimatedValue.toLocaleString()}
                        </Text>
                      </Td>
                      <Td>
                        <Button
                          size="sm"
                          leftIcon={<FiEye />}
                          onClick={() => handleViewLead(lead)}
                        >
                          View
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </CardBody>
      </Card>

      {/* Lead Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Lead Details - {selectedLead?.customerName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedLead && (
              <VStack spacing={6} align="stretch">
                {/* Customer Information */}
                <Card variant="outline">
                  <CardHeader>
                    <Heading size="sm">👤 Customer Information</Heading>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={2} spacing={4}>
                      <VStack align="start" spacing={2}>
                        <Text fontWeight="bold">Name:</Text>
                        <Text>{selectedLead.customerName}</Text>
                      </VStack>
                      <VStack align="start" spacing={2}>
                        <Text fontWeight="bold">Email:</Text>
                        <HStack>
                          <Icon as={FiMail} color="blue.500" />
                          <Text>{selectedLead.email}</Text>
                        </HStack>
                      </VStack>
                      <VStack align="start" spacing={2}>
                        <Text fontWeight="bold">Phone:</Text>
                        <HStack>
                          <Icon as={FiPhone} color="green.500" />
                          <Text>{selectedLead.phone}</Text>
                        </HStack>
                      </VStack>
                      <VStack align="start" spacing={2}>
                        <Text fontWeight="bold">Inquiry Date:</Text>
                        <Text>{new Date(selectedLead.inquiryDate).toLocaleDateString()}</Text>
                      </VStack>
                    </SimpleGrid>
                  </CardBody>
                </Card>

                {/* Lead Information */}
                <Card variant="outline">
                  <CardHeader>
                    <Heading size="sm">📋 Lead Information</Heading>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={2} spacing={4}>
                      <VStack align="start" spacing={2}>
                        <Text fontWeight="bold">Product:</Text>
                        <Text>{selectedLead.productName}</Text>
                      </VStack>
                      <VStack align="start" spacing={2}>
                        <Text fontWeight="bold">Estimated Value:</Text>
                        <Text color="green.600" fontWeight="bold">
                          ₹{selectedLead.estimatedValue.toLocaleString()}
                        </Text>
                      </VStack>
                      <VStack align="start" spacing={2}>
                        <Text fontWeight="bold">Status:</Text>
                        <Badge colorScheme={getStatusColor(selectedLead.status)}>
                          {selectedLead.status}
                        </Badge>
                      </VStack>
                      <VStack align="start" spacing={2}>
                        <Text fontWeight="bold">Priority:</Text>
                        <Badge colorScheme={getPriorityColor(selectedLead.priority)} variant="outline">
                          {selectedLead.priority}
                        </Badge>
                      </VStack>
                    </SimpleGrid>
                    
                    <Box mt={4}>
                      <Text fontWeight="bold" mb={2}>Notes:</Text>
                      <Text bg="gray.50" p={3} borderRadius="md">
                        {selectedLead.notes}
                      </Text>
                    </Box>
                  </CardBody>
                </Card>

                {/* Follow-up Actions */}
                <Card variant="outline">
                  <CardHeader>
                    <Heading size="sm">🔄 Follow-up Actions</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4}>
                      <Box w="full">
                        <Text fontWeight="bold" mb={2}>Update Status:</Text>
                        <Select 
                          value={leadStatus} 
                          onChange={(e) => setLeadStatus(e.target.value)}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Closed Won">Closed Won</option>
                          <option value="Closed Lost">Closed Lost</option>
                        </Select>
                      </Box>
                      
                      <Box w="full">
                        <Text fontWeight="bold" mb={2}>Add Follow-up Note:</Text>
                        <Textarea
                          placeholder="Enter follow-up notes..."
                          value={followUpNote}
                          onChange={(e) => setFollowUpNote(e.target.value)}
                          rows={4}
                        />
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="teal" onClick={handleUpdateLead}>
              Update Lead
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default LeadManagement;

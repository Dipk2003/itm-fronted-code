import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Avatar,
  Card,
  CardBody,
  Badge,
  Flex,
  IconButton,
  useColorModeValue,
  Collapse,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Link,
  Tooltip,
  Button,
  useBreakpointValue,
  Circle,
  Wrap,
  WrapItem,
  ScaleFade,
} from '@chakra-ui/react';
import {
  FiMessageCircle,
  FiSend,
  FiMinimize2,
  FiMaximize2,
  FiX,
  FiUser,
  FiPhone,
  FiMail,
  FiStar,
  FiTrendingUp,
  FiShoppingBag,
  FiSearch,
  FiHelpCircle,
  FiVolume2,
  FiVolumeX,
} from 'react-icons/fi';
import { useChatBot } from '../hooks/useChatBot';
import { useAuth } from '../contexts/AuthContext';


const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(() => {
    const hasOpened = localStorage.getItem('chatbot-opened');
    return hasOpened ? false : true;
  });
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  
  const {
    sendMessage,
    startSession,
    isLoading,
  } = useChatBot();

  const { isOpen: isVendorModalOpen, onOpen: onVendorModalOpen, onClose: onVendorModalClose } = useDisclosure();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bubbleBg = useColorModeValue('blue.500', 'blue.600');
  const userBubbleBg = useColorModeValue('gray.100', 'gray.700');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !sessionId) {
      initializeChat();
    }
  }, [isOpen, sessionId]);

const initializeChat = async () => {
    localStorage.setItem('chatbot-opened', 'true');
    try {
      const response = await startSession();
      setSessionId(response.sessionId);
      setMessages([{
        id: Date.now(),
        text: response.response,
        isBot: true,
        timestamp: new Date(),
        recommendations: response.recommendations || []
      }]);
      if (soundEnabled) {
        new Audio('/notification.mp3').play();
      }
    } catch (error) {
      console.error('Failed to start chat session:', error);
      setMessages([{
        id: Date.now(),
        text: "Hello! Welcome to iTech! I'm here to help you find the best vendors and products. How can I assist you today?",
        isBot: true,
        timestamp: new Date(),
        recommendations: []
      }]);
    }
  };

const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = message;
    setMessage('');

    try {
      const response = await sendMessage({
        message: currentMessage,
        sessionId: sessionId,
        userId: user?.id,
      });

      const botMessage = {
        id: Date.now() + 1,
        text: response.response,
        isBot: true,
        timestamp: new Date(),
        recommendations: response.recommendations || []
      };

      setMessages(prev => [...prev, botMessage]);
      setSessionId(response.sessionId);

      // Play sound for new bot message
      if (soundEnabled) {
        new Audio('/notification.mp3').play();
      }

      // Update unread count if the chat is minimized
      if (isMinimized) {
        setUnreadCount(unreadCount + 1);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm experiencing some technical difficulties. Please try again.",
        isBot: true,
        timestamp: new Date(),
        recommendations: []
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVendorClick = (vendor) => {
    setSelectedVendor(vendor);
    onVendorModalOpen();
  };

  const formatText = (text) => {
    // Convert markdown-like formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/(\d+\.\s)/g, '<br/>$1')
      .replace(/•/g, '•')
      .split('\n')
      .map((line, index) => (
        <Text key={index} mb={line.trim() ? 1 : 2}>
          <span dangerouslySetInnerHTML={{ __html: line }} />
        </Text>
      ));
  };

  const VendorCard = ({ vendor, onClick }) => (
    <Card
      size="sm"
      mb={2}
      cursor="pointer"
      onClick={onClick}
      _hover={{ shadow: 'md', transform: 'translateY(-1px)' }}
      transition="all 0.2s"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <CardBody p={3}>
        <VStack align="start" spacing={2}>
          <HStack justify="space-between" w="100%">
            <Text fontWeight="bold" fontSize="sm" color="blue.600">
              {vendor.vendorName}
            </Text>
            <Badge colorScheme="blue" size="sm">
              {vendor.vendorType}
            </Badge>
          </HStack>
          
          <HStack spacing={4} fontSize="xs" color="gray.600">
            <HStack>
              <FiMail size={12} />
              <Text>{vendor.vendorEmail}</Text>
            </HStack>
            <HStack>
              <FiPhone size={12} />
              <Text>{vendor.vendorPhone}</Text>
            </HStack>
          </HStack>
          
          {vendor.performanceScore && (
            <HStack>
              <FiTrendingUp size={12} />
              <Text fontSize="xs" color="green.600">
                Score: {vendor.performanceScore.toFixed(1)}
              </Text>
            </HStack>
          )}
          
          <Text fontSize="xs" color="gray.500">
            {vendor.reason}
          </Text>
          
          {vendor.products && vendor.products.length > 0 && (
            <Box>
              <Text fontSize="xs" fontWeight="medium" mb={1}>Products:</Text>
              <Text fontSize="xs" color="gray.600">
                {vendor.products.slice(0, 3).join(', ')}
                {vendor.products.length > 3 && '...'}
              </Text>
            </Box>
          )}
        </VStack>
      </CardBody>
    </Card>
  );

  if (!isOpen) {
    return (
      <Box position="fixed" bottom="20px" right="20px" zIndex={1000}>
        <Tooltip label="Chat with our AI assistant" placement="left">
          <IconButton
            icon={<FiMessageCircle />}
            colorScheme="blue"
            size="lg"
            isRound
            onClick={() => setIsOpen(true)}
            shadow="lg"
            _hover={{ transform: 'scale(1.1)' }}
            transition="all 0.2s"
          />
        </Tooltip>
      </Box>
    );
  }

return (
    <>
      <Box
        position="fixed"
        bottom="20px"
        right="20px"
        zIndex={1000}
        w={isMinimized ? "300px" : "400px"}
        h={isMinimized ? "60px" : "500px"}
        _after={{
          content: `"${unreadCount}"`,
          display: unreadCount > 0 ? 'block' : 'none',
          position: 'absolute',
          top: '-10px',
          right: '-10px',
          background: 'red',
          borderRadius: '50%',
          color: 'white',
          width: '20px',
          height: '20px',
          fontSize: '12px',
          lineHeight: '20px',
          textAlign: 'center',
        }}
        bg={bgColor}
        borderRadius="lg"
        shadow="xl"
        border="1px"
        borderColor={borderColor}
        transition="all 0.3s"
      >
        {/* Header */}
        <Flex
          p={4}
          bg="blue.500"
          color="white"
          borderTopRadius="lg"
          justify="space-between"
          align="center"
        >
          <HStack>
            <Avatar size="sm" name="iTech Bot" bg="blue.600" />
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold" fontSize="sm">iTech Assistant</Text>
              <Text fontSize="xs" opacity={0.8}>
                {isLoading ? 'Typing...' : 'Online'}
              </Text>
            </VStack>
          </HStack>
          
          <HStack spacing={1}>
            <IconButton
              icon={soundEnabled ? <FiVolume2 /> : <FiVolumeX />}
              size="sm"
              variant="ghost"
              colorScheme="whiteAlpha"
              onClick={() => setSoundEnabled(!soundEnabled)}
            />
            <IconButton
              icon={isMinimized ? <FiMaximize2 /> : <FiMinimize2 />}
              size="sm"
              variant="ghost"
              colorScheme="whiteAlpha"
              onClick={() => setIsMinimized(!isMinimized)}
            />
            <IconButton
              icon={<FiX />}
              size="sm"
              variant="ghost"
              colorScheme="whiteAlpha"
              onClick={() => setIsOpen(false)}
            />
          </HStack>
        </Flex>

        <Collapse in={!isMinimized}>
          {/* Messages */}
          <Box
            h="360px"
            overflowY="auto"
            p={4}
            bg={bgColor}
          >
            <VStack spacing={3} align="stretch">
              {messages.map((msg) => (
                <Box key={msg.id}>
                  <Flex justify={msg.isBot ? 'flex-start' : 'flex-end'}>
                    <Box
                      maxW="80%"
                      bg={msg.isBot ? bubbleBg : userBubbleBg}
                      color={msg.isBot ? 'white' : 'inherit'}
                      p={3}
                      borderRadius="lg"
                      borderBottomLeftRadius={msg.isBot ? 'sm' : 'lg'}
                      borderBottomRightRadius={msg.isBot ? 'lg' : 'sm'}
                    >
                      {msg.isBot ? formatText(msg.text) : <Text>{msg.text}</Text>}
                      
                      <Text
                        fontSize="xs"
                        opacity={0.7}
                        mt={1}
                        textAlign={msg.isBot ? 'left' : 'right'}
                      >
                        {msg.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Text>
                    </Box>
                  </Flex>
                  
                  {/* Vendor Recommendations */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <Box mt={3} ml={msg.isBot ? 0 : 'auto'} maxW="80%">
                      <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600">
                        Recommended Vendors:
                      </Text>
                      {msg.recommendations.map((vendor, index) => (
                        <VendorCard
                          key={index}
                          vendor={vendor}
                          onClick={() => handleVendorClick(vendor)}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
              
              {isLoading && (
                <Flex justify="flex-start">
                  <Box
                    bg={bubbleBg}
                    color="white"
                    p={3}
                    borderRadius="lg"
                    borderBottomLeftRadius="sm"
                  >
                    <HStack>
                      <Spinner size="sm" />
                      <Text>Thinking...</Text>
                    </HStack>
                  </Box>
                </Flex>
              )}
              
              <div ref={messagesEndRef} />
            </VStack>
          </Box>

{/* Quick Reply Buttons */}
        {showQuickReplies && (
          <Box p={4} borderTop="1px" borderColor={borderColor} bg={bgColor}>
            <HStack spacing={2} wrap="wrap">
              {['What is your return policy?', 'Tell me about new products.', 'Can I talk to support?'].map((quickReply, index) => (
                <Button key={index} variant="outline" size="sm" onClick={() => setMessage(quickReply)}>
                  {quickReply}
                </Button>
              ))}
            </HStack>
          </Box>
        )}
          <Box p={4} borderTop="1px" borderColor={borderColor}>
            <HStack spacing={2}>
              <Input
                placeholder="Ask me about products, vendors, or services..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                size="sm"
              />
              <IconButton
                icon={<FiSend />}
                colorScheme="blue"
                size="sm"
                onClick={handleSendMessage}
                isLoading={isLoading}
                disabled={!message.trim()}
              />
            </HStack>
          </Box>
        </Collapse>
      </Box>

      {/* Vendor Details Modal */}
      <Modal isOpen={isVendorModalOpen} onClose={onVendorModalClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <FiUser />
              <Text>Vendor Details</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedVendor && (
              <VStack align="start" spacing={4}>
                <HStack justify="space-between" w="100%">
                  <Text fontSize="xl" fontWeight="bold" color="blue.600">
                    {selectedVendor.vendorName}
                  </Text>
                  <Badge colorScheme="blue" size="lg">
                    {selectedVendor.vendorType}
                  </Badge>
                </HStack>
                
                <VStack align="start" spacing={2} w="100%">
                  <HStack>
                    <FiMail />
                    <Link href={`mailto:${selectedVendor.vendorEmail}`} color="blue.500">
                      {selectedVendor.vendorEmail}
                    </Link>
                  </HStack>
                  <HStack>
                    <FiPhone />
                    <Link href={`tel:${selectedVendor.vendorPhone}`} color="blue.500">
                      {selectedVendor.vendorPhone}
                    </Link>
                  </HStack>
                  {selectedVendor.performanceScore && (
                    <HStack>
                      <FiStar />
                      <Text>Performance Score: {selectedVendor.performanceScore.toFixed(1)}/10</Text>
                    </HStack>
                  )}
                </VStack>
                
                <Box w="100%">
                  <Text fontWeight="medium" mb={2}>Why Recommended:</Text>
                  <Text color="gray.600">{selectedVendor.reason}</Text>
                </Box>
                
                {selectedVendor.products && selectedVendor.products.length > 0 && (
                  <Box w="100%">
                    <Text fontWeight="medium" mb={2}>Products:</Text>
                    <VStack align="start" spacing={1}>
                      {selectedVendor.products.map((product, index) => (
                        <Text key={index} fontSize="sm" color="gray.600">
                          • {product}
                        </Text>
                      ))}
                    </VStack>
                  </Box>
                )}
                
                {selectedVendor.categories && selectedVendor.categories.length > 0 && (
                  <Box w="100%">
                    <Text fontWeight="medium" mb={2}>Categories:</Text>
                    <HStack wrap="wrap" spacing={2}>
                      {selectedVendor.categories.map((category, index) => (
                        <Badge key={index} variant="outline" colorScheme="blue">
                          {category}
                        </Badge>
                      ))}
                    </HStack>
                  </Box>
                )}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChatBot;

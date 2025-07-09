import React, { useState } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Icon,
  useColorModeValue,
  Slide,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle message sending logic here
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Box
        position="fixed"
        bottom="20px"
        right="20px"
        zIndex={1000}
      >
        <Button
          colorScheme="blue"
          size="lg"
          borderRadius="full"
          onClick={() => setIsOpen(!isOpen)}
          shadow="lg"
          w="60px"
          h="60px"
          p={0}
        >
          <Icon as={isOpen ? FiX : FiMessageCircle} w={6} h={6} />
        </Button>
      </Box>

      {/* Chat Window */}
      <Slide direction="bottom" in={isOpen} style={{ zIndex: 999 }}>
        <Box
          position="fixed"
          bottom="100px"
          right="20px"
          w="350px"
          h="400px"
          bg={bgColor}
          border="1px"
          borderColor={borderColor}
          borderRadius="lg"
          shadow="xl"
          display="flex"
          flexDirection="column"
        >
          {/* Chat Header */}
          <Box
            bg="blue.500"
            color="white"
            p={4}
            borderTopRadius="lg"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text fontWeight="bold">Chat with us</Text>
            <IconButton
              icon={<FiX />}
              variant="ghost"
              color="white"
              size="sm"
              onClick={() => setIsOpen(false)}
            />
          </Box>

          {/* Chat Messages */}
          <Box flex={1} p={4} overflowY="auto">
            <VStack spacing={3} align="stretch">
              <Box
                bg="gray.100"
                p={3}
                borderRadius="md"
                maxW="80%"
                alignSelf="flex-start"
              >
                <Text fontSize="sm">
                  Hello! How can we help you today?
                </Text>
              </Box>
              <Box
                bg="blue.500"
                color="white"
                p={3}
                borderRadius="md"
                maxW="80%"
                alignSelf="flex-end"
              >
                <Text fontSize="sm">
                  I'm looking for industrial equipment.
                </Text>
              </Box>
              <Box
                bg="gray.100"
                p={3}
                borderRadius="md"
                maxW="80%"
                alignSelf="flex-start"
              >
                <Text fontSize="sm">
                  Great! What type of industrial equipment are you looking for?
                </Text>
              </Box>
            </VStack>
          </Box>

          {/* Message Input */}
          <Box p={4} borderTop="1px" borderColor={borderColor}>
            <InputGroup>
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                pr="60px"
              />
              <InputRightElement width="60px">
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <Icon as={FiSend} />
                </Button>
              </InputRightElement>
            </InputGroup>
          </Box>
        </Box>
      </Slide>
    </>
  );
};

export default ChatWidget;

import React from 'react';
import {
  VStack,
  Heading,
  Text,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Icon,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiBox, FiCheckCircle, FiClock } from 'react-icons/fi';

const OrderHistory = ({ orders = [] }) => {
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <VStack align="stretch" spacing={5} w="full">
      <Heading size="md" color="gray.800">
        Order History
      </Heading>
      <Divider borderColor={borderColor} />
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Order ID</Th>
            <Th>Date</Th>
            <Th>Status</Th>
            <Th isNumeric>Total Items</Th>
            <Th isNumeric>Amount</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((order) => (
            <Tr key={order.id}>
              <Td>{order.id}</Td>
              <Td>{order.date}</Td>
              <Td>
                <Badge 
                  colorScheme={
                    order.status === 'Delivered'
                      ? 'green'
                      : order.status === 'Processing'
                      ? 'orange'
                      : 'red'
                  }
                  variant="outline"
                >
                  <HStack spacing={1}>
                    <Icon
                      as={
                        order.status === 'Delivered'
                          ? FiCheckCircle
                          : order.status === 'Processing'
                          ? FiClock
                          : FiBox
                      }
                    />
                    <Text>{order.status}</Text>
                  </HStack>
                </Badge>
              </Td>
              <Td isNumeric>{order.items}</Td>
              <Td isNumeric>{order.amount}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </VStack>
  );
};

export default OrderHistory;


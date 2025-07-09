import React from 'react';
import { Box } from '@chakra-ui/react';
import Header from './Header';
import Footer from '../common/Footer';
import ChatWidget from '../common/ChatWidget';

const Layout = ({ children, showHeader = true, showFooter = true, showChat = true }) => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      {showHeader && <Header />}
      <Box flex={1}>
        {children}
      </Box>
      {showFooter && <Footer />}
      {showChat && <ChatWidget />}
    </Box>
  );
};

export default Layout;

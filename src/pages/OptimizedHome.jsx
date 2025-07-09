import React from 'react';
import { Box } from '@chakra-ui/react';
import { Layout } from '../components/layout';
import {
  HeroSection,
  CategoriesSection,
  FeaturedProducts,
} from '../components/home';

const OptimizedHome = () => {
  return (
    <Layout>
      <Box>
        <HeroSection />
        <CategoriesSection />
        <FeaturedProducts />
      </Box>
    </Layout>
  );
};

export default OptimizedHome;

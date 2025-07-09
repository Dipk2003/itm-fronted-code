export const CATEGORIES = [
  {
    id: 'industrial-equipment',
    name: 'Industrial & Equipment',
    icon: 'tool',
    color: 'blue.500',
    description: 'Machinery, tools, and industrial equipment',
    subcategories: [
      'Manufacturing Equipment',
      'Construction Machinery',
      'Power Tools',
      'Industrial Automation',
      'Material Handling',
    ],
  },
  {
    id: 'clothing-apparel',
    name: 'Clothing & Apparel',
    icon: 'user',
    color: 'purple.500',
    description: 'Fashion, textiles, and apparel',
    subcategories: [
      'Men\'s Clothing',
      'Women\'s Clothing',
      'Children\'s Clothing',
      'Footwear',
      'Accessories',
    ],
  },
  {
    id: 'consumer-electronics',
    name: 'Consumer Electronics',
    icon: 'monitor',
    color: 'green.500',
    description: 'Electronics and technology products',
    subcategories: [
      'Smartphones',
      'Laptops & Computers',
      'Home Appliances',
      'Audio & Video',
      'Gaming',
    ],
  },
  {
    id: 'agricultural-products',
    name: 'Agricultural Products',
    icon: 'truck',
    color: 'orange.500',
    description: 'Farm products and agricultural equipment',
    subcategories: [
      'Fresh Produce',
      'Grains & Cereals',
      'Farm Equipment',
      'Seeds & Fertilizers',
      'Livestock',
    ],
  },
  {
    id: 'medical-supplies',
    name: 'Medical Supplies',
    icon: 'heart',
    color: 'red.500',
    description: 'Healthcare and medical equipment',
    subcategories: [
      'Medical Devices',
      'Pharmaceuticals',
      'Hospital Equipment',
      'Surgical Instruments',
      'First Aid',
    ],
  },
  {
    id: 'home-furniture',
    name: 'Home & Furniture',
    icon: 'home',
    color: 'teal.500',
    description: 'Home decor and furniture',
    subcategories: [
      'Living Room',
      'Bedroom',
      'Kitchen',
      'Office Furniture',
      'Outdoor',
    ],
  },
  {
    id: 'building-materials',
    name: 'Building Materials',
    icon: 'package',
    color: 'gray.500',
    description: 'Construction and building materials',
    subcategories: [
      'Cement & Concrete',
      'Steel & Metal',
      'Wood & Timber',
      'Plumbing',
      'Electrical',
    ],
  },
  {
    id: 'food-beverages',
    name: 'Food & Beverages',
    icon: 'shopping-bag',
    color: 'pink.500',
    description: 'Food products and beverages',
    subcategories: [
      'Processed Foods',
      'Beverages',
      'Snacks',
      'Dairy Products',
      'Organic Foods',
    ],
  },
  {
    id: 'packaging-supplies',
    name: 'Packaging Supplies',
    icon: 'package',
    color: 'cyan.500',
    description: 'Packaging materials and supplies',
    subcategories: [
      'Boxes & Containers',
      'Labels & Stickers',
      'Bubble Wrap',
      'Tape & Adhesives',
      'Custom Packaging',
    ],
  },
  {
    id: 'chemicals',
    name: 'Chemicals',
    icon: 'droplet',
    color: 'yellow.500',
    description: 'Industrial and specialty chemicals',
    subcategories: [
      'Industrial Chemicals',
      'Cleaning Chemicals',
      'Specialty Chemicals',
      'Laboratory Reagents',
      'Paints & Coatings',
    ],
  },
];

export const FEATURED_CATEGORIES = CATEGORIES.slice(0, 4);

export const getCategoryById = (id) => {
  return CATEGORIES.find(category => category.id === id);
};

export const getCategoryByName = (name) => {
  return CATEGORIES.find(category => 
    category.name.toLowerCase().includes(name.toLowerCase())
  );
};

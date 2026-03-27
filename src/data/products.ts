export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  tags: string[];
  inStock: boolean;
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Noise Cancelling Headphones',
    price: 299.99,
    description:
      'Experience pure sound with our industry-leading noise cancellation.',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    tags: ['New', 'Sale'],
    inStock: true,
  },
  {
    id: '2',
    name: 'Mechanical Gaming Keyboard',
    price: 149.5,
    description:
      'Tactile feedback and RGB backlighting for the ultimate gaming experience.',
    image:
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&q=80',
    tags: ['Gaming'],
    inStock: true,
  },
  {
    id: '3',
    name: 'Smart Fitness Watch',
    price: 199.0,
    description:
      'Track your health, workouts, and notifications directly from your wrist.',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    tags: ['Fitness', 'Tech'],
    inStock: false,
  },
  {
    id: '4',
    name: 'Ergonomic Office Chair',
    price: 349.0,
    description:
      'Designed for comfort and lumbar support during long working hours.',
    image:
      'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80',
    tags: ['Office'],
    inStock: true,
  },
];

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(p => p.id === id);
};

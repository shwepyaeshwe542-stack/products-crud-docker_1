const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Seed products data
const products = [
  {
    name: 'MacBook Pro 16"',
    slug: 'macbook-pro-16',
    description: 'Apple M3 Max chip, 36GB RAM, 1TB SSD. Perfect for developers and creative professionals.',
    price: 2499.99,
    category: 'Electronics',
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'
  },
  {
    name: 'Sony WH-1000XM5',
    slug: 'sony-wh1000xm5',
    description: 'Industry-leading noise canceling wireless headphones with premium sound quality.',
    price: 399.99,
    category: 'Electronics',
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400'
  },
  {
    name: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
    description: 'Titanium design, A17 Pro chip, advanced camera system with 5x telephoto.',
    price: 999.99,
    category: 'Electronics',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1592286927505-25f428e27100?w=400'
  },
  {
    name: 'Herman Miller Aeron Chair',
    slug: 'herman-miller-aeron',
    description: 'Ergonomic office chair with PostureFit support and adjustable features.',
    price: 1395.00,
    category: 'Furniture',
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400'
  },
  {
    name: 'LG UltraWide Monitor 34"',
    slug: 'lg-ultrawide-34',
    description: '34-inch curved WQHD display with HDR10 support and USB-C connectivity.',
    price: 599.99,
    category: 'Electronics',
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400'
  }
];

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.product.deleteMany({});
  console.log('🗑️  Cleared existing products');

  // Seed products
  for (const product of products) {
    await prisma.product.create({ data: product });
    console.log(`✅ Created: ${product.name}`);
  }

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

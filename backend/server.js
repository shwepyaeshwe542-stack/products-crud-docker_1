const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// GET /api/products - Get all products with pagination
app.get('/api/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const offset = (page - 1) * limit;

    const where = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (category) {
      where.category = category;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/products/:id - Get single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/products - Create new product
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const { name, slug, description, price, category, stock } = req.body;
    
    // Validate required fields
    if (!name || !slug || !price || !category) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, slug, price, and category are required' 
      });
    }

    const imageUrl = req.file 
      ? `/uploads/${req.file.filename}` 
      : null;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || null,
        price: parseFloat(price),
        category,
        stock: parseInt(stock) || 0,
        imageUrl
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Handle unique constraint violation (duplicate slug)
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        error: 'A product with this slug already exists' 
      });
    }
    
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/products/:id - Update product
app.put('/api/products/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, price, category, stock } = req.body;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updateData = {
      name,
      slug,
      description: description || null,
      price: parseFloat(price),
      category,
      stock: parseInt(stock) || 0
    };

    // If new image uploaded, update imageUrl and delete old image
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
      
      // Delete old image file if it exists
      if (existingProduct.imageUrl) {
        const oldImagePath = path.join(__dirname, existingProduct.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        error: 'A product with this slug already exists' 
      });
    }
    
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/products/:id - Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete image file if exists
    if (existingProduct.imageUrl) {
      const imagePath = path.join(__dirname, existingProduct.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/categories - Get unique categories
app.get('/api/categories', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category']
    });
    
    const categories = products.map(p => p.category).filter(Boolean);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await prisma.$disconnect();
  process.exit(0);
});
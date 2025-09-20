const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3001;

app.use(express.json());

const mongoUri = process.env.MONGODB_INVENTORY_URI || 'mongodb://glosleep-mongodb:27017/glosleep_inventory';
mongoose.connect(mongoUri)
  .then(() => console.log('Inventory Service connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Product Schema
const productSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, enum: ['mattress', 'pillow', 'foam'], required: true },
  stock: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true }
});

const Product = mongoose.model('Product', productSchema);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Inventory Service' });
});

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.end('# HELP inventory_service_info Inventory service metadata\n# TYPE inventory_service_info gauge\ninventory_service_info{version="1.0"} 1\n');
});

// Get all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Get product by SKU
app.get('/products/:sku', async (req, res) => {
  try {
    const product = await Product.findOne({ sku: req.params.sku });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// Add new product
app.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
});

// Update stock
app.patch('/products/:sku/stock', async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findOneAndUpdate(
      { sku: req.params.sku },
      { $inc: { stock: quantity } },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Stock updated successfully', product });
  } catch (error) {
    res.status(400).json({ message: 'Error updating stock', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Inventory service running on port ${port}`);
});
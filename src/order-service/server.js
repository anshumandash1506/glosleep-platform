const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();
const port = 3002;

app.use(express.json());

const mongoUri = process.env.MONGODB_URI || 'mongodb://glosleep-mongodb:27017/glosleep_orders';
mongoose.connect(mongoUri)
  .then(() => console.log('Order Service connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Order Schema
const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  items: [{
    sku: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['created', 'confirmed', 'shipped', 'delivered'], default: 'created' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Order Service' });
});

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.end('# HELP order_service_info Order service metadata\n# TYPE order_service_info gauge\norder_service_info{version="1.0"} 1\n');
});

// Create new order
app.post('/orders', async (req, res) => {
  try {
    const { customerName, items } = req.body;
    
    // Calculate total and verify items (in real app, would check inventory)
    let totalAmount = 0;
    for (const item of items) {
      // Here you would verify with Inventory Service
      totalAmount += item.quantity * item.price;
    }

    const order = new Order({
      orderId: 'ORD' + Date.now(),
      customerName,
      items,
      totalAmount,
      status: 'created'
    });

    await order.save();
    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    res.status(400).json({ message: 'Error creating order', error: error.message });
  }
});

// Get all orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// Update order status
app.patch('/orders/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(400).json({ message: 'Error updating order', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Order service running on port ${port}`);
});
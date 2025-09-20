const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3003;

app.use(express.json());

const mongoUri = process.env.MONGODB_PROCUREMENT_URI || 'mongodb://glosleep-mongodb:27017/glosleep_procurement';
mongoose.connect(mongoUri)
  .then(() => console.log('Procurement Service connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Supplier Schema
const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  materialType: { type: String, enum: ['pu_foam', 'epe_foam', 'fabric', 'springs'], required: true }
});

const purchaseOrderSchema = new mongoose.Schema({
  poNumber: { type: String, required: true, unique: true },
  supplier: { type: String, required: true },
  material: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'delivered'], default: 'pending' },
  orderDate: { type: Date, default: Date.now }
});

const Supplier = mongoose.model('Supplier', supplierSchema);
const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Procurement Service' });
});

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.end('# HELP procurement_service_info Procurement service metadata\n# TYPE procurement_service_info gauge\nprocurement_service_info{version="1.0"} 1\n');
});

// Add new supplier
app.post('/suppliers', async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.status(201).json({ message: 'Supplier added successfully', supplier });
  } catch (error) {
    res.status(400).json({ message: 'Error adding supplier', error: error.message });
  }
});

// Get all suppliers
app.get('/suppliers', async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching suppliers', error: error.message });
  }
});

// Create purchase order
app.post('/purchase-orders', async (req, res) => {
  try {
    const { supplier, material, quantity, unitPrice } = req.body;
    const totalAmount = quantity * unitPrice;

    const po = new PurchaseOrder({
      poNumber: 'PO' + Date.now(),
      supplier,
      material,
      quantity,
      unitPrice,
      totalAmount,
      status: 'pending'
    });

    await po.save();
    res.status(201).json({ message: 'Purchase order created successfully', po });
  } catch (error) {
    res.status(400).json({ message: 'Error creating purchase order', error: error.message });
  }
});

// Get all purchase orders
app.get('/purchase-orders', async (req, res) => {
  try {
    const purchaseOrders = await PurchaseOrder.find().sort({ orderDate: -1 });
    res.json(purchaseOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchase orders', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Procurement service running on port ${port}`);
});
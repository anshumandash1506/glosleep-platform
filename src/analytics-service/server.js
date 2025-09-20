const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3004;

app.use(express.json());

const mongoUri = process.env.MONGODB_URI || 'mongodb://glosleep-mongodb:27017/glosleep_analytics';
mongoose.connect(mongoUri)
  .then(() => console.log('Analytics Service connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Analytics Schema
const analyticsSchema = new mongoose.Schema({
  reportType: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  generatedAt: { type: Date, default: Date.now }
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Analytics Service' });
});

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.end('# HELP analytics_service_info Analytics service metadata\n# TYPE analytics_service_info gauge\nanalytics_service_info{version="1.0"} 1\n');
});

// Get sales report
app.get('/reports/sales', async (req, res) => {
  try {
    // In a real app, this would aggregate data from Order service
    const report = {
      totalSales: 150000,
      topProducts: [
        { name: 'Premium Mattress', revenue: 75000 },
        { name: 'Memory Foam Pillow', revenue: 25000 }
      ],
      monthlyTrend: [12000, 15000, 18000, 21000]
    };

    // Save report
    const analytics = new Analytics({
      reportType: 'sales',
      data: report
    });
    await analytics.save();

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error generating sales report', error: error.message });
  }
});

// Get inventory report
app.get('/reports/inventory', async (req, res) => {
  try {
    // In a real app, this would fetch data from Inventory service
    const report = {
      totalProducts: 45,
      lowStockItems: 5,
      inventoryValue: 225000
    };

    const analytics = new Analytics({
      reportType: 'inventory',
      data: report
    });
    await analytics.save();

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error generating inventory report', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Analytics service running on port ${port}`);
});
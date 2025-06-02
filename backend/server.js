require('dotenv').config(); // Load environment variables at the top
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('sellor.ai API is running!');
});

// Import routes
const authRoutes = require('./routes/auth');
const vendorRoutes = require('./routes/vendors');
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin'); // New admin route import
const aiHelperRoutes = require('./routes/aiHelperRoutes'); // Added AI routes

// Middleware to parse JSON
app.use(express.json());

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes); // New admin route usage
app.use('/api/ai', aiHelperRoutes); // Added AI routes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

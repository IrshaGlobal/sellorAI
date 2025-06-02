const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect } = require('../middleware/authMiddleware');

// POST /api/products - Create a new product
router.post('/', protect, async (req, res) => {
  const {
    title,
    description,
    price,
    sku,
    inventory_quantity,
    category,
    status = 'draft',
    image_url, // Still expecting this, though frontend sends null for now
    tags // Added tags
  } = req.body;

  const storeId = req.vendor.storeId;

  if (!title || !price || !storeId) {
    return res.status(400).json({ message: 'Title, price, and store ID are required.' });
  }
  if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
    return res.status(400).json({ message: 'Invalid price.' });
  }
  const invQty = parseInt(inventory_quantity);
  if (isNaN(invQty) || invQty < 0) {
    return res.status(400).json({ message: 'Invalid inventory quantity.' });
  }
  // Validate tags if necessary (e.g., ensure it's an array)
  if (tags && !Array.isArray(tags)) {
    return res.status(400).json({ message: 'Tags should be an array.' });
  }


  try {
    const newProductQuery = `
      INSERT INTO Products (
        store_id, title, description, price, sku, inventory_quantity, category, status, image_url, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *; 
    `;
    
    const values = [
      storeId, title, description, parseFloat(price), sku, invQty, category, status, image_url, tags // Added tags to values
    ];
    
    const result = await db.query(newProductQuery, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    // Check for specific DB errors if needed, e.g., if tags column doesn't exist
    if (error.message.includes("column \"tags\" of relation \"products\" does not exist")) {
        return res.status(500).json({ message: "Database schema error: 'tags' column missing. Please update database schema."})
    }
    res.status(500).json({ message: 'Failed to create product.' });
  }
});

// GET /api/products - Get all products for the authenticated vendor's store
router.get('/', protect, async (req, res) => {
  const storeId = req.vendor.storeId;
  if (!storeId) {
    return res.status(400).json({ message: 'Store ID not found for vendor.' });
  }
  try {
    const getProductsQuery = 'SELECT * FROM Products WHERE store_id = $1 ORDER BY created_at DESC;';
    const result = await db.query(getProductsQuery, [storeId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products.' });
  }
});

// GET /api/products/:productId
router.get('/:productId', protect, async (req, res) => {
  const { productId } = req.params;
  const storeId = req.vendor.storeId;
  try {
    const getProductQuery = 'SELECT * FROM Products WHERE product_id = $1 AND store_id = $2;';
    const result = await db.query(getProductQuery, [productId, storeId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found or not owned by vendor.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product.' });
  }
});

// PUT /api/products/:productId (Placeholder)
router.put('/:productId', protect, async (req, res) => {
  // TODO: Implement update logic
  // Remember to handle all fields, including tags
  res.status(501).json({ message: 'Update product not implemented yet.' });
});

// DELETE /api/products/:productId (Placeholder)
router.delete('/:productId', protect, async (req, res) => {
  // TODO: Implement delete logic
  res.status(501).json({ message: 'Delete product not implemented yet.' });
});

module.exports = router;

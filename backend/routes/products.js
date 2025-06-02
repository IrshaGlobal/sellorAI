const express = require('express');
const router = express.Router();

// Placeholder for product routes
router.post('/', (req, res) => {
  res.status(501).json({ message: 'Create product not implemented' });
});

router.get('/:productId', (req, res) => {
  res.status(501).json({ message: 'Get product details not implemented' });
});

module.exports = router;

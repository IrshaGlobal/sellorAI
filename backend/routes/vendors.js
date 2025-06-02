const express = require('express');
const router = express.Router();

// Placeholder for vendor routes
router.get('/:vendorId/store', (req, res) => {
  res.status(501).json({ message: 'Get vendor store details not implemented' });
});

module.exports = router;

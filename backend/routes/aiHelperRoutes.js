const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // For potential temp file management
const { protect } = require('../middleware/authMiddleware');
const aiProductService = require('../services/aiProductService');

const router = express.Router();

// Configure Multer for image uploads
// For MVP, storing in memory. For production, consider diskStorage or cloud storage (e.g., S3)
const storage = multer.memoryStorage(); // Stores file in memory as a Buffer

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Error: File upload only supports the following filetypes - ' + allowedTypes), false);
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// POST /api/ai/generate-product-details-from-image
router.post(
  '/generate-product-details-from-image',
  protect, // Ensure user is authenticated
  upload.single('productImage'), // 'productImage' is the field name in the form-data
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded.' });
    }

    try {
      // The image is in req.file.buffer if using memoryStorage
      const imageBuffer = req.file.buffer;
      
      // Call the AI Product Service (which currently returns mock data)
      // In a real scenario, you might save the temp file and pass its path,
      // or pass the buffer directly if the AI SDK supports it.
      const aiGeneratedDetails = await aiProductService.generateDetailsFromImage(imageBuffer, req.file.mimetype);

      res.status(200).json(aiGeneratedDetails);

    } catch (error) {
      console.error('AI Detail Generation Error:', error);
      if (error.message.startsWith('Error: File upload only supports')) {
          return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: 'Failed to generate product details using AI.' });
    }
  }
);

module.exports = router;

const jwt = require('jsonwebtoken');
const db = require('../db'); // Assuming db/index.js exports a query function

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Minimal check for required fields from token
      if (!decoded.vendorId || !decoded.storeId) {
          console.error('Token missing vendorId or storeId:', decoded);
          return res.status(401).json({ message: 'Not authorized, token invalid (missing crucial data)' });
      }

      req.vendor = {
        id: decoded.vendorId,
        email: decoded.email, // Optional, but good to have if present
        storeId: decoded.storeId
      };
      
      next();
    } catch (error) {
      console.error('Auth Middleware Error:', error.name, error.message);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Not authorized, token invalid.' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Not authorized, token expired.' });
      }
      return res.status(401).json({ message: 'Not authorized, token failed.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };

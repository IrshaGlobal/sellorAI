const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db'); // Assuming db/index.js exports a query function
const { v4: uuidv4 } = require('uuid'); // Using uuid library for store_id if not using DB default

const router = express.Router();

// Helper to generate subdomain from store name
const generateSubdomain = (storeName) => {
  return storeName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { storeName, email, password } = req.body;

  // 1. Validate input
  if (!storeName || !email || !password) {
    return res.status(400).json({ message: 'Store name, email, and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  // Basic email validation
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  const subdomain = generateSubdomain(storeName);
  if (!subdomain) {
    return res.status(400).json({ message: 'Invalid store name for generating a subdomain.' });
  }

  try {
    // 2. Check if email or subdomain already exists
    const existingVendor = await db.query('SELECT * FROM Vendors WHERE email = $1', [email]);
    if (existingVendor.rows.length > 0) {
      return res.status(409).json({ message: 'Email already exists.' });
    }

    const existingStore = await db.query('SELECT * FROM Stores WHERE subdomain = $1', [subdomain]);
    if (existingStore.rows.length > 0) {
      // If subdomain from store name exists, try adding a short random string
      // This is a simple conflict resolution; a more robust solution might be needed
      const newSubdomain = `${subdomain}-${uuidv4().slice(0, 4)}`;
      const conflictingStore = await db.query('SELECT * FROM Stores WHERE subdomain = $1', [newSubdomain]);
      if (conflictingStore.rows.length > 0) {
        return res.status(409).json({ message: 'Store name results in a conflicting subdomain. Please try a different store name.' });
      }
      // If no conflict with newSubdomain, this logic needs to be integrated into store creation.
      // For now, let's keep it simple and ask user to change store name if subdomain conflicts.
       return res.status(409).json({ message: 'Store name (subdomain) already exists. Please choose a different store name.' });
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Create new Store and Vendor records (ideally in a transaction)
    let newStore;
    let newVendor;

    const client = await db.pool.connect(); // Get a client from the pool for transaction
    try {
      await client.query('BEGIN');

      // Create Store
      const storeQuery = `
        INSERT INTO Stores (store_name, subdomain, contact_email, created_at, updated_at)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING store_id, store_name, subdomain, created_at;
      `;
      const storeValues = [storeName, subdomain, email];
      const storeResult = await client.query(storeQuery, storeValues);
      newStore = storeResult.rows[0];

      // Create Vendor
      const vendorQuery = `
        INSERT INTO Vendors (email, password_hash, store_id, created_at, updated_at)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING vendor_id, email, store_id, created_at;
      `;
      const vendorValues = [email, passwordHash, newStore.store_id];
      const vendorResult = await client.query(vendorQuery, vendorValues);
      newVendor = vendorResult.rows[0];

      await client.query('COMMIT');
    } catch (transactionError) {
      await client.query('ROLLBACK');
      console.error('Transaction Error:', transactionError);
      return res.status(500).json({ message: 'Registration failed during transaction.' });
    } finally {
      client.release(); // Release the client back to the pool
    }

    // 5. Generate JWT token
    const tokenPayload = {
      vendorId: newVendor.vendor_id,
      email: newVendor.email,
      storeId: newStore.store_id,
      subdomain: newStore.subdomain
    };
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.error("JWT_SECRET is not defined in environment variables.");
        return res.status(500).json({ message: "Server configuration error: JWT secret missing." });
    }
    const token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: '1d' }); // Token expires in 1 day

    // 6. Return token and basic user/store info
    res.status(201).json({
      message: 'Vendor registered successfully!',
      token,
      vendor: {
        id: newVendor.vendor_id,
        email: newVendor.email,
      },
      store: {
        id: newStore.store_id,
        name: newStore.store_name,
        subdomain: newStore.subdomain,
      }
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Internal server error during registration.' });
  }
});

// Placeholder for login (will be implemented later)
router.post('/login', (req, res) => {
  res.status(501).json({ message: 'Login endpoint not implemented yet.' });
});

module.exports = router;

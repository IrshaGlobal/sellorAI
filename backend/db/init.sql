-- Sellor.ai MVP Database Initialization
-- File: backend/db/init.sql

-- Ensure extensions are enabled (if not already)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; -- For generating UUIDs

BEGIN;

-- Stores Table
CREATE TABLE IF NOT EXISTS Stores (
    store_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    custom_domain VARCHAR(255) UNIQUE,
    custom_domain_status VARCHAR(50) CHECK (custom_domain_status IN ('pending_verification', 'verified', 'error')), -- Enum like
    logo_url VARCHAR(1024),
    accent_color VARCHAR(7) DEFAULT '#000000',
    store_description TEXT,
    contact_email VARCHAR(255),
    subscription_plan_id VARCHAR(100) DEFAULT 'launch_plan_mvp',
    subscription_status VARCHAR(50) DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'trialing', 'past_due')), -- Enum like
    stripe_account_id VARCHAR(255) UNIQUE, -- Stripe Connect Account ID
    stripe_account_status VARCHAR(50) CHECK (stripe_account_status IN ('pending', 'connected', 'error')), -- Enum like
    default_shipping_rate DECIMAL(10, 2) DEFAULT 0.00,
    free_shipping_threshold DECIMAL(10, 2),
    policy_refund TEXT,
    policy_privacy TEXT,
    policy_terms TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Vendors Table (User accounts for store owners)
CREATE TABLE IF NOT EXISTS Vendors (
    vendor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    store_id UUID UNIQUE NOT NULL REFERENCES Stores(store_id) ON DELETE CASCADE, -- Each vendor owns one store
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP -- Renamed from last_login_at for consistency
);

-- Optional: Trigger to update "updated_at" timestamp on Stores table
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER set_stores_timestamp
BEFORE UPDATE ON Stores
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE OR REPLACE TRIGGER set_vendors_timestamp
BEFORE UPDATE ON Vendors
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_stores_subdomain ON Stores(subdomain);
CREATE INDEX IF NOT EXISTS idx_stores_custom_domain ON Stores(custom_domain);
CREATE INDEX IF NOT EXISTS idx_vendors_email ON Vendors(email);
CREATE INDEX IF NOT EXISTS idx_vendors_store_id ON Vendors(store_id);

COMMIT;

-- Note to user:
-- To run this SQL script, you can use a tool like psql:
-- psql -U your_username -d your_database_name -a -f backend/db/init.sql
-- Ensure your .env file in the backend directory has the correct DATABASE_URL.
-- Make sure the database specified in DATABASE_URL exists before running.
-- You might need to create the "uuid-ossp" extension if gen_random_uuid() is used and not available by default:
-- In psql, connect to your database and run: CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

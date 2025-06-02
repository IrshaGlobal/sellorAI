# sellor.ai MVP Database Schema (Conceptual)

This document outlines the conceptual database schema for the MVP of sellor.ai.
The primary strategy for multi-tenancy is Shared Database, Shared Schema, using a `store_id` to partition data where applicable.

## Core Tables

### `PlatformAdmins`
-   `admin_id` (Primary Key, UUID/Serial)
-   `email` (String, Unique, Not Null)
-   `password_hash` (String, Not Null)
-   `created_at` (Timestamp, Default NOW())
-   `last_login_at` (Timestamp)

### `Vendors` (Represents the user account for a vendor)
-   `vendor_id` (Primary Key, UUID/Serial)
-   `email` (String, Unique, Not Null)
-   `password_hash` (String, Not Null)
-   `store_id` (Foreign Key, References `Stores.store_id`, Unique, Not Null)
-   `created_at` (Timestamp, Default NOW())
-   `updated_at` (Timestamp, Default NOW())

### `Stores` (Represents a vendor's store)
-   `store_id` (Primary Key, UUID/Serial)
-   `store_name` (String, Not Null) - Display name
-   `subdomain` (String, Unique, Not Null) - e.g., "mystore" for "mystore.sellor.ai"
-   `custom_domain` (String, Unique, Nullable)
-   `custom_domain_status` (Enum: 'pending_verification', 'verified', 'error', Nullable)
-   `logo_url` (String, Nullable)
-   `accent_color` (String, Nullable, Default '#000000')
-   `store_description` (Text, Nullable)
-   `contact_email` (String, Nullable) - For customer inquiries to vendor
-   `subscription_plan_id` (String, Default 'launch_plan_mvp') # Could reference a plans table later
-   `subscription_status` (Enum: 'active', 'inactive', 'trialing', 'past_due', Default 'active')
-   `stripe_account_id` (String, Nullable) - Vendor's Stripe Connect account ID
-   `stripe_account_status` (Enum: 'pending', 'connected', 'error', Nullable)
-   `default_shipping_rate` (Decimal, Nullable, Default 0.00)
-   `free_shipping_threshold` (Decimal, Nullable)
-   `policy_refund` (Text, Nullable)
-   `policy_privacy` (Text, Nullable)
-   `policy_terms` (Text, Nullable)
-   `created_at` (Timestamp, Default NOW())
-   `updated_at` (Timestamp, Default NOW())

### `Products`
-   `product_id` (Primary Key, UUID/Serial)
-   `store_id` (Foreign Key, References `Stores.store_id`, Not Null) - **Tenant ID**
-   `title` (String, Not Null)
-   `description` (Text, Nullable)
-   `price` (Decimal, Not Null)
-   `sku` (String, Nullable)
-   `inventory_quantity` (Integer, Default 0)
-   `image_url` (String, Nullable)
-   `tags` (Array of Strings/JSONB, Nullable)
-   `category` (String, Nullable) - From predefined list
-   `status` (Enum: 'draft', 'published', Default 'draft')
-   `created_at` (Timestamp, Default NOW())
-   `updated_at` (Timestamp, Default NOW())

### `Categories` (Predefined by Platform Admin)
- `category_id` (Primary Key, UUID/Serial)
- `name` (String, Unique, Not Null)
- `slug` (String, Unique, Not Null)
- `is_active` (Boolean, Default true)

### `Orders`
-   `order_id` (Primary Key, UUID/Serial)
-   `store_id` (Foreign Key, References `Stores.store_id`, Not Null) - **Tenant ID**
-   `customer_email` (String, Not Null)
-   `customer_name` (String, Nullable)
-   `shipping_address_line1` (String, Nullable)
-   `shipping_address_line2` (String, Nullable)
-   `shipping_address_city` (String, Nullable)
-   `shipping_address_state` (String, Nullable)
-   `shipping_address_postal_code` (String, Nullable)
-   `shipping_address_country` (String, Nullable)
-   `subtotal_amount` (Decimal, Not Null)
-   `shipping_amount` (Decimal, Not Null)
-   `total_amount` (Decimal, Not Null)
-   `order_status` (Enum: 'pending', 'processing', 'shipped', 'delivered', 'cancelled', Default 'pending')
-   `payment_status` (Enum: 'pending', 'succeeded', 'failed', Default 'pending')
-   `stripe_payment_intent_id` (String, Nullable)
-   `tracking_number` (String, Nullable)
-   `created_at` (Timestamp, Default NOW())
-   `updated_at` (Timestamp, Default NOW())

### `OrderItems`
-   `order_item_id` (Primary Key, UUID/Serial)
-   `order_id` (Foreign Key, References `Orders.order_id`, Not Null)
-   `product_id` (Foreign Key, References `Products.product_id`, Not Null)
-   `store_id` (Foreign Key, References `Stores.store_id`, Not Null) - **Tenant ID** (denormalized for easier querying within a store's context)
-   `quantity` (Integer, Not Null)
-   `price_at_purchase` (Decimal, Not Null) - Price of the product at the time of order
-   `product_title_at_purchase` (String, Not Null) - Title of product at time of order
-   `created_at` (Timestamp, Default NOW())

## Platform Specific Tables

### `PlatformSubscriptions` (For sellor.ai charging vendors)
- `subscription_id` (Primary Key, String from Stripe)
- `vendor_id` (Foreign Key, References `Vendors.vendor_id`, Not Null)
- `stripe_customer_id` (String, Not Null)
- `plan_id` (String, Not Null, e.g., "launch_plan_mvp")
- `status` (String, From Stripe: active, canceled, past_due, etc.)
- `current_period_start` (Timestamp)
- `current_period_end` (Timestamp)
- `cancel_at_period_end` (Boolean, Default false)
- `created_at` (Timestamp, Default NOW())
- `updated_at` (Timestamp, Default NOW())

### `PlatformTransactionFees` (For tracking fees sellor.ai takes)
- `fee_id` (Primary Key, UUID/Serial)
- `order_id` (Foreign Key, References `Orders.order_id`, Not Null)
- `store_id` (Foreign Key, References `Stores.store_id`, Not Null)
- `amount` (Decimal, Not Null) - The fee amount collected
- `stripe_transfer_id` (String, Nullable) - If fee collected via Stripe Connect transfer
- `collected_at` (Timestamp, Default NOW())

# sellor.ai - AI-Powered Multi-Vendor E-commerce Platform (MVP)

Welcome to sellor.ai! This project aims to build a multi-vendor SaaS e-commerce platform where the key differentiator for the Minimum Viable Product (MVP) is AI-assisted product creation from a single image.

## Project Structure

The project is organized into two main parts:

-   **/frontend**: A Next.js application that serves:
    -   The public-facing SaaS Landing Page (`sellor.ai`).
    -   The Vendor Dashboard (for registered vendors to manage their stores).
    -   The Platform Super Admin Panel (for platform owners to manage vendors).
    -   The End-Customer Storefronts (dynamically rendered based on vendor data).
-   **/backend**: A Node.js with Express API that handles:
    -   Business logic, data processing, and database interactions.
    -   Authentication and authorization for vendors and platform admins.
    -   Integration with AI services for product creation.
    -   Integration with Stripe for payment processing (Stripe Connect for vendors, Stripe Subscriptions for platform).
-   **/schema.md**: Contains the conceptual database schema design.
-   **/backend/db/init.sql**: SQL script to initialize the database tables.

## Getting Started

### Prerequisites:
*   Node.js (latest LTS version recommended, e.g., v18 or v20)
*   npm (usually comes with Node.js)
*   PostgreSQL server running.
*   Access keys for AI service (e.g., OpenAI, Google Vertex AI) - *for later features*
*   Stripe API keys (Test keys for development) - *for later features*

### 1. Backend Setup:

*   Navigate to the `backend` directory: `cd backend`
*   Install dependencies: `npm install`
*   **Environment Variables:**
    *   Copy `.env.example` to a new file named `.env`: `cp .env.example .env`
    *   Edit `.env` and configure your settings:
        *   `DATABASE_URL`: Your PostgreSQL connection string.
            *   Format: `postgresql://DB_USER:DB_PASSWORD@DB_HOST:DB_PORT/DB_NAME`
            *   Example: `postgresql://postgres:mysecretpassword@localhost:5432/sellor_mvp`
        *   `JWT_SECRET`: A strong, random string for signing JWTs (e.g., generate one using a password generator).
        *   `PORT`: The port the backend server will run on (defaults to 3001).
*   **Database Initialization:**
    *   Ensure your PostgreSQL server is running and you have created the database specified in `DATABASE_URL`.
    *   Connect to your PostgreSQL instance (e.g., using `psql`) and run the following command if the `uuid-ossp` extension (for `gen_random_uuid()`) is not already enabled in your target database:
        ```sql
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        ```
    *   Execute the initialization script to create tables. You can use a tool like `psql`:
        ```bash
        psql -d YOUR_DATABASE_NAME -U YOUR_DB_USER -f db/init.sql
        # Or, if your DATABASE_URL is correctly set in your shell environment for psql:
        # psql $DATABASE_URL -f db/init.sql
        ```
        Replace `YOUR_DATABASE_NAME` and `YOUR_DB_USER` accordingly.
    *   **AI Service & Database for Products:**
        *   The AI-assisted product creation currently uses a **mock AI service** in the backend. To integrate a real AI service (e.g., OpenAI), you would need to update `backend/services/aiProductService.js` and configure `OPENAI_API_KEY` (or similar) in the `backend/.env` file.
        *   The `Products` table requires a `tags` column (e.g., `tags TEXT[]` for PostgreSQL) for saving product tags. Ensure your `backend/db/init.sql` reflects this and your database schema is updated accordingly.
*   **Start the development server:**
    ```bash
    npm run dev
    ```
    This will start the backend server using `nodemon`, typically on `http://localhost:3001`.

### 2. Frontend Setup:

*   Navigate to the `frontend` directory: `cd frontend`
*   Install dependencies: `npm install`
*   **Environment Variables:**
    *   Copy `.env.local.example` to a new file named `.env.local`: `cp .env.local.example .env.local`
    *   Edit `.env.local` if your backend API is running on a different URL than the default:
        *   `NEXT_PUBLIC_API_URL`: The full URL to your backend API (defaults to `http://localhost:3001/api`).
*   **Start the Next.js development server:**
    ```bash
    npm run dev
    ```
    This will start the frontend server, typically on `http://localhost:3000`.

### 3. Accessing the Applications:

*   **SaaS Landing Page / Registration:** `http://localhost:3000`
*   **Vendor Dashboard:** After registration/login, you'll be redirected to `http://localhost:3000/dashboard`.
*   **Admin Login:** `http://localhost:3000/admin/login` (Admin panel is basic structure only at this stage).
*   **Backend API Base URL:** `http://localhost:3001`

## Current Functionality

*   **Vendor Authentication:**
    *   Users can visit the landing page and navigate to register.
    *   Registration involves providing store name, email, and password. The backend creates new store and vendor records, and issues a JWT.
    *   Registered users can log in using their email and password to obtain a JWT.
    *   The frontend stores the JWT in localStorage and uses it for authenticated API requests.
    *   Logout functionality clears the JWT.
    *   Dashboard pages are protected, redirecting to login if no valid JWT is present.
    *   Login/register pages redirect to the dashboard if a user is already authenticated.

*   **Product Management (Initial - AI Assisted with Mock AI):**
    *   Vendors can navigate to a 'Manage Products' page from their dashboard.
    *   An 'Add New Product' button leads to the AI-assisted product creation form.
    *   **Image Upload for AI Analysis:** Vendors can upload a product image (JPEG/PNG, max 5MB).
    *   **AI Detail Generation (Mocked):** Upon image upload, the system simulates an AI service call (currently mocked in the backend). This mock service returns pre-filled suggestions for Product Title, Description, Tags, and Category.
    *   **Form Population & Editing:** The AI-suggested details populate the product form, and vendors can then edit these fields. Vendors must manually input Price, and can optionally add SKU and Inventory Quantity.
    *   **Saving Products:** Vendors can save the product as 'Draft' or 'Published'. This sends all product data (including AI-generated/edited fields and manual entries) to the backend, where it's saved to the database.
        *   *Note:* The actual product image file is analyzed for details but not yet persistently stored or linked via a URL in the database in this phase. The `image_url` field in the database is `NULL`.
        *   *Database Schema Note:* This functionality requires the `Products` table to have a `tags TEXT[]` column (for PostgreSQL).
    *   **Product Listing:** The 'Manage Products' page displays a list of the vendor's products fetched from the backend, showing details like a placeholder for image, title, price, inventory, and status.

## Technology Stack

-   **Frontend:** Next.js (React), Axios
-   **Backend:** Node.js, Express, PostgreSQL (`pg` client), `bcryptjs` (password hashing), `jsonwebtoken` (JWTs), `dotenv`, `multer` (for file uploads), `axios` (for potential AI service calls)
-   **Database:** PostgreSQL
-   **Development:** `nodemon` (backend)
-   **AI Integration:** (Mocked in `backend/services/aiProductService.js`. Planned for OpenAI GPT-4 Vision / Google Vertex AI via API)
-   **Payments:** (Planned for future - Stripe Connect & Subscriptions)
-   **Deployment:** (Planned for future - Vercel, Netlify, Fly.io, Render, or cloud provider AWS/GCP)
-   **Email Service:** (Planned for future - SendGrid, Mailgun, AWS SES)

---

This README is a living document and will be updated as the project evolves.

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

## Current Functionality (Vendor Registration & Login Flow)

*   Users can visit the landing page.
*   Users can click "Create Your Store Now" to go to the registration page.
*   On the registration page, users can enter a store name, email, and password.
*   The backend validates this information, creates a new store and vendor record in the PostgreSQL database, and returns a JWT.
*   The frontend stores this JWT in localStorage and redirects the user to their dashboard page with a success message.
*   Users can logout from the dashboard, which clears the JWT and redirects to the login page with a success message.
*   On the login page, registered users can enter their email and password.
*   The backend validates credentials, and if correct, issues a new JWT.
*   The frontend stores the JWT and redirects to the dashboard with a success message.
*   The dashboard page has basic protection; if no JWT is found, it redirects to the login page.
*   If a logged-in user tries to access the login or registration page, they are redirected to their dashboard.

## Technology Stack

-   **Frontend:** Next.js (React), Axios
-   **Backend:** Node.js, Express, PostgreSQL (`pg` client), `bcryptjs` (password hashing), `jsonwebtoken` (JWTs), `dotenv`
-   **Database:** PostgreSQL
-   **Development:** `nodemon` (backend)
-   **AI Integration:** (Planned for future - OpenAI GPT-4 Vision / Google Vertex AI via API)
-   **Payments:** (Planned for future - Stripe Connect & Subscriptions)
-   **Deployment:** (Planned for future - Vercel, Netlify, Fly.io, Render, or cloud provider AWS/GCP)
-   **Email Service:** (Planned for future - SendGrid, Mailgun, AWS SES)

---

This README is a living document and will be updated as the project evolves.

# GadgetIMS - Gadget Inventory Management System

## Database Setup Instructions

### Prerequisites

- MySQL Server installed and running (v5.7 or higher)
- MySQL user account with CREATE DATABASE privileges
- Node.js v18 or higher

### Step 1: Create Database and Tables

Run the following command in your terminal or MySQL client:

```bash
mysql -u root -p < database.sql
```

When prompted, enter your MySQL root password.

**Alternative Method (Using MySQL Workbench or MySQL Client):**

1. Open MySQL Workbench or MySQL command line
2. Open the `database.sql` file
3. Execute all the queries

This will:

- Create the `gadgetims` database
- Create all required tables (products, daily_sales, sale_items, customers, suppliers, purchases, purchase_items, users, inventory_alerts)

### Step 2: Create a Default User (Required for Login)

After the database is created, you need to create a user account to log in to the application.

**Using MySQL Client:**

```bash
mysql -u root -p gadgetims
```

Then run (replace with your desired username and password):

```sql
INSERT INTO users (username, password_hash) VALUES ('admin', '$2a$10$1n5qzRqKzCHVOmzC9SqhE.xvvw3j1zBE8hTZqh6Y8qgVXIIz0Qi5i');
```

This creates a user with:

- Username: `admin`
- Password: `admin123` (hashed)

**To create your own hashed password:**

1. Use an online bcrypt generator or
2. Use Node.js:

```bash
node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"
```

### Step 3: Backend Setup

1. Navigate to the API folder:

```bash
cd apps/api
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file by copying `.env.example`:

```bash
cp .env.example .env
```

4. Update the `.env` file with your MySQL credentials:

```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASS=your-mysql-password
DB_NAME=gadgetims
SESSION_SECRET=your-secret-key-change-in-production
```

5. Start the backend:

```bash
npm run dev
```

The backend should start on `http://localhost:5000`

### Step 4: Frontend Setup

1. In a new terminal, navigate to the web folder:

```bash
cd apps/web
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file by copying `.env.example`:

```bash
cp .env.example .env
```

4. Start the frontend:

```bash
npm run dev
```

The frontend should start on `http://localhost:5173`

### Step 5: Verify Database Connection

Check the backend logs for:

```
Server running on 5000
```

If you see connection errors, verify:

- MySQL is running
- Database credentials in `.env` are correct
- Database `gadgetims` exists

### Step 6: Login to the Application

1. Open `http://localhost:5173` in your browser
2. Login with:
   - Username: `admin`
   - Password: `admin123` (or your custom password)

````

The backend will connect to the database and run on `http://localhost:5000`

### Step 4: Test the Connection

```bash
# Get all products
curl http://localhost:5000/api/products

# Health check
curl http://localhost:5000/api/health
````

---

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Daily Sales

- `GET /api/sales` - Get all sales
- `GET /api/sales?date=2026-01-15` - Get sales by date
- `GET /api/sales/:id` - Get sale details with items
- `POST /api/sales` - Create new sale
- `PUT /api/sales/:id` - Update sale
- `DELETE /api/sales/:id` - Delete sale

### Example POST Request (Daily Sale)

```json
{
  "items": [
    {
      "modelName": "iPhone 15 Pro",
      "quantity": 2,
      "unitPrice": 999,
      "total": 1998
    },
    {
      "modelName": "USB-C Cable",
      "quantity": 5,
      "unitPrice": 9.99,
      "total": 49.95
    }
  ],
  "total_amount": 2047.95,
  "sale_date": "2026-01-15"
}
```

---

## Frontend Integration

The frontend is set up to connect to the backend API at `http://localhost:5000`.

To connect the Daily Sale form to the backend, the frontend will send POST requests to `/api/sales` when you click "Save Sale".

---

## Database Schema

### products

- id, name, sku, category, unit_price, stock, reorder_level, created_at, updated_at

### daily_sales

- id, sale_date, total_amount, created_at

### sale_items

- id, sale_id, product_id, model_name, quantity, unit_price, total, created_at

### customers

- id, name, email, phone, address, city, created_at

### suppliers

- id, name, email, phone, address, city, created_at

### purchases

- id, supplier_id, purchase_date, total_amount, status, created_at

### purchase_items

- id, purchase_id, product_id, quantity, unit_price, total, created_at

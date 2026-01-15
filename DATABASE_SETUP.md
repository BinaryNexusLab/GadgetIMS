# GadgetIMS - Gadget Inventory Management System

## Database Setup Instructions

### Prerequisites

- MySQL Server installed and running
- MySQL user account with root access (or a user with CREATE DATABASE privileges)

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

- Create the `gadget_ims` database
- Create all required tables (products, daily_sales, sale_items, customers, suppliers, purchases, purchase_items)
- Insert sample data for testing

### Step 2: Verify Database Connection

Check the `.env` file in the backend folder:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=gadget_ims
```

Update `DB_PASS` if your MySQL root user has a password.

### Step 3: Start the Backend

```bash
cd backend
npm run dev
```

The backend will connect to the database and run on `http://localhost:5000`

### Step 4: Test the Connection

```bash
# Get all products
curl http://localhost:5000/api/products

# Health check
curl http://localhost:5000/api/health
```

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

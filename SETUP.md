# GadgetIMS - Complete Setup Guide

## Quick Start

### 1. Database Setup

```bash
# Create the database and tables
mysql -u root -p < database.sql
```

Then create a default user:

```bash
mysql -u root -p gadgetims -e "INSERT INTO users (username, password_hash) VALUES ('admin', '\$2a\$10\$1n5qzRqKzCHVOmzC9SqhE.xvvw3j1zBE8hTZqh6Y8qgVXIIz0Qi5i');"
```

Login credentials: `admin` / `admin123`

### 2. Backend Setup

```bash
# Navigate to API folder
cd apps/api

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your MySQL credentials
# Then start the server
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Frontend Setup

```bash
# In a new terminal, navigate to web folder
cd apps/web

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start the development server
npm run dev
```

Frontend runs on: `http://localhost:5173`

## Features

### Products Management

- Add, edit, delete products
- Track inventory levels
- Monitor reorder levels
- Search products

### Daily Sales

- Record daily sales transactions
- Add multiple items per sale
- Generate PDF sales reports
- View sales history by date
- Data persists in database

### Authentication

- Secure login system
- Session-based authentication
- User management (first user can be created without auth)

## Database Structure

### Tables

- **products** - Product inventory
- **daily_sales** - Daily sales records
- **sale_items** - Individual items within each sale
- **customers** - Customer information
- **suppliers** - Supplier information
- **purchases** - Purchase orders
- **purchase_items** - Items in purchase orders
- **users** - User accounts
- **inventory_alerts** - Inventory alerts

## Environment Variables

### Backend (apps/api/.env)

```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASS=your-mysql-password
DB_NAME=gadgetims
SESSION_NAME=gadgetims.sid
SESSION_SECRET=your-secret-key-change-in-production
SESSION_LIFETIME_MINUTES=120
ALLOWED_ORIGIN=http://localhost:5173,http://localhost:5000
BCRYPT_SALT_ROUNDS=10
```

### Frontend (apps/web/.env)

```
VITE_API_URL=http://localhost:5000/api
```

## Troubleshooting

### Database Connection Error

- Verify MySQL is running
- Check credentials in `.env`
- Ensure database `gadgetims` exists

### Frontend Shows White Screen

- Check browser console for errors
- Ensure backend is running on port 5000
- Clear browser cache and reload

### Data Not Persisting

- Verify database tables exist
- Check backend logs for SQL errors
- Ensure proper INSERT/UPDATE queries are executed

### Login Issues

- Verify user exists in `users` table
- Check password hash is correct
- Clear session cookies and try again

## Production Deployment

1. Change `SESSION_SECRET` to a strong random value
2. Set `NODE_ENV=production`
3. Use environment-specific database credentials
4. Set `ALLOWED_ORIGIN` to your frontend domain
5. Build frontend: `npm run build`
6. Deploy `dist/` folder to your web server
7. Deploy API code and ensure Node.js is running

## Support

For issues or questions, refer to the individual README files:

- [Database Setup](./DATABASE_SETUP.md)
- API: [apps/api/](./apps/api/)
- Web: [apps/web/](./apps/web/)

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import productRoutes from './routes/product.routes';
import salesRoutes from './routes/sales.routes';
import authRoutes from './routes/auth.routes';
import session from 'express-session';
import mysqlSession from 'express-mysql-session';
import { requireAuth, attachNoCache } from './middleware/auth';

const app = express();
const allowedOrigins = process.env.ALLOWED_ORIGIN
  ? process.env.ALLOWED_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:5000'];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

// Create MySQL store using the factory
const MySQLStore = (mysqlSession as any)(session);

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  createDatabaseTable: true,
});

app.use(express.json());
app.use(
  (session as any)({
    name: process.env.SESSION_NAME || 'gadgetims.sid',
    secret: process.env.SESSION_SECRET || 'change-me',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: Number(process.env.SESSION_LIFETIME_MINUTES || '120') * 60 * 1000,
    },
  }),
);

app.use(attachNoCache);

// Public auth routes
app.use('/api/auth', authRoutes);

// Everything below this line requires authentication
app.use(requireAuth);
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);

// Health check endpoint (protected)
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on', PORT));

export default app;

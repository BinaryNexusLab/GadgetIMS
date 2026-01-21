import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../config/db';

const router = Router();
const dbConn = db.promise();
const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || '10');

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: 'Username and password are required' });
  }

  try {
    const [rows] = await dbConn.query(
      'SELECT id, username, password_hash FROM users WHERE username = ? LIMIT 1',
      [username],
    );

    const userRow: any = Array.isArray(rows) ? rows[0] : null;

    if (!userRow) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, userRow.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // @ts-ignore - session.user augmentation
    req.session.user = { id: userRow.id, username: userRow.username };
    // @ts-ignore - session.user augmentation
    return res.json({ message: 'Logged in', user: req.session.user });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: 'Username and password are required' });
  }

  try {
    const [countRows] = await dbConn.query(
      'SELECT COUNT(*) AS count FROM users',
    );
    const userCount = Array.isArray(countRows)
      ? (countRows[0] as any).count
      : 0;

    // Allow first user to be created without auth. Subsequent users require a session.
    // @ts-ignore - session.user augmentation
    if (userCount > 0 && !req.session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [existingRows] = await dbConn.query(
      'SELECT id FROM users WHERE username = ?',
      [username],
    );
    if (Array.isArray(existingRows) && existingRows.length > 0) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const passwordHash = await bcrypt.hash(password, saltRounds);

    await dbConn.query(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [username, passwordHash],
    );

    return res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error('Register error', err);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.clearCookie(process.env.SESSION_NAME || 'gadgetims.sid');
    return res.json({ message: 'Logged out' });
  });
});

router.get('/me', (req, res) => {
  // @ts-ignore - session.user augmentation
  if (req.session.user) {
    // @ts-ignore - session.user augmentation
    return res.json({ user: req.session.user });
  }
  return res.status(401).json({ error: 'Unauthorized' });
});

export default router;

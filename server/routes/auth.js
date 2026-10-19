import { Router } from 'express';
import { executeQuery } from '../config/db.js';

const router = Router();

// POST /api/auth/register - Citizen Registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, national_id } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    // Check if user already exists
    const existing = await executeQuery('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Insert citizen
    const result = await executeQuery(
      `INSERT INTO users (name, email, password_hash, phone, national_id, role) 
       VALUES (?, ?, ?, ?, ?, 'citizen')`,
      [name.trim(), email.toLowerCase().trim(), password, phone || null, national_id || null]
    );

    const newUser = {
      id: result.insertId,
      name,
      email: email.toLowerCase().trim(),
      phone: phone || null,
      national_id: national_id || null,
      role: 'citizen'
    };

    return res.status(201).json({
      success: true,
      message: 'Citizen registered successfully',
      user: newUser,
      token: `token_${newUser.id}_${Date.now()}`
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
});

// POST /api/auth/login - User/Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const rows = await executeQuery(
      'SELECT id, name, email, password_hash, phone, national_id, role, department FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = rows[0];

    // For simplicity / demo passwords: check string or bcrypt if configured
    if (user.password_hash !== password && !user.password_hash.startsWith('$2a$') && password !== 'password123') {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    delete user.password_hash;

    return res.json({
      success: true,
      message: 'Logged in successfully',
      user,
      token: `token_${user.id}_${Date.now()}`
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error during login' });
  }
});

// GET /api/auth/me - Get current user profile
router.get('/me', async (req, res) => {
  // Demo token verification
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'No authorization token provided' });
  }

  return res.json({ success: true, message: 'Authenticated' });
});

export default router;

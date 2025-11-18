import express from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Auth routes - pending setup' });
});

export default router;

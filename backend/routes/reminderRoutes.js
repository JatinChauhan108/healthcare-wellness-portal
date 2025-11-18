import express from 'express';
import {
  createReminder,
  getReminders,
  updateReminder,
  deleteReminder,
  completeReminder
} from '../controllers/reminderController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.post('/', authenticate, createReminder);
router.get('/', authenticate, getReminders);
router.put('/:id', authenticate, updateReminder);
router.patch('/:id/complete', authenticate, completeReminder);
router.delete('/:id', authenticate, deleteReminder);

export default router;

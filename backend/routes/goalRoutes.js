import express from 'express';
import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  logGoalProgress,
  getGoalLogs,
  getGoalDashboard
} from '../controllers/goalController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.get('/dashboard', authenticate, getGoalDashboard);
router.post('/', authenticate, createGoal);
router.get('/', authenticate, getGoals);
router.put('/:id', authenticate, updateGoal);
router.delete('/:id', authenticate, deleteGoal);
router.post('/:id/log', authenticate, logGoalProgress);
router.get('/:id/logs', authenticate, getGoalLogs);

export default router;

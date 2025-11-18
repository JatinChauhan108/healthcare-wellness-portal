import express from 'express';
import {
  createHealthTip,
  getHealthTips,
  updateHealthTip,
  deleteHealthTip,
  getDailyTip
} from '../controllers/healthTipController.js';
import { getByCategory as getPublicHealthInfo } from '../controllers/informationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/public/:category', getPublicHealthInfo);

// Protected routes
router.post('/', authenticate, createHealthTip);
router.get('/', authenticate, getHealthTips);
router.get('/daily', authenticate, getDailyTip);
router.put('/:id', authenticate, updateHealthTip);
router.delete('/:id', authenticate, deleteHealthTip);

export default router;

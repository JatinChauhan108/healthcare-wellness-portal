import express from 'express';
import { getProfile, updateProfile, getAuditLogs } from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.get('/', authenticate, getProfile);
router.put('/', authenticate, updateProfile);
router.get('/audit-logs', authenticate, getAuditLogs);

export default router;

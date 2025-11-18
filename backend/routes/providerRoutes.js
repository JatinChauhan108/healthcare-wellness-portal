import express from 'express';
import {
  getAssignedPatients,
  assignPatient
} from '../controllers/providerController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected and provider-only
router.get('/patients', authenticate, authorize('provider'), getAssignedPatients);
router.post('/assign', authenticate, authorize('provider'), assignPatient);

export default router;

import express from 'express';
import {
  getAllInformation,
  getByCategory,
  getInformationById,
  createInformation,
  updateInformation,
  deleteInformation
} from '../controllers/informationController.js';

const router = express.Router();

// Public routes
router.get('/', getAllInformation);
router.get('/category/:category', getByCategory);
router.get('/:id', getInformationById);

// Admin routes (protect with auth middleware when ready)
router.post('/', createInformation);
router.put('/:id', updateInformation);
router.delete('/:id', deleteInformation);

export default router;

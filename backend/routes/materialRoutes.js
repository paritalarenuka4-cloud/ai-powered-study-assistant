import express from 'express';
import {
  getMaterials,
  getMaterialById,
  createMaterial,
  generateMaterialAI,
} from '../controllers/materialController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getMaterials);
router.get('/:id', getMaterialById);
router.post('/', protect, createMaterial);
router.post('/generate', protect, generateMaterialAI);

export default router;

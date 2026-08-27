import { Router } from 'express';
import {
  getModules,
  createModule,
  updateModule,
  deleteModule,
  reorderModules
} from '../controllers/moduleController';

const router = Router();

router.get('/', getModules);
router.post('/', createModule);
router.put('/reorder', reorderModules); // Must be placed before /:id route
router.put('/:id', updateModule);
router.delete('/:id', deleteModule);

export default router;

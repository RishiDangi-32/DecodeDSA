import { Router } from 'express';
import {
  getLessons,
  getLessonBySlug,
  createLesson,
  updateLesson,
  deleteLesson
} from '../controllers/lessonController';

const router = Router();

router.get('/', getLessons);
router.get('/:slug', getLessonBySlug);
router.post('/', createLesson);
router.put('/:id', updateLesson);
router.delete('/:id', deleteLesson);

export default router;

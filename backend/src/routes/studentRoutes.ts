import { Router } from 'express';
import {
  getStudentCourses,
  getStudentCourseDetails,
  getStudentLesson
} from '../controllers/studentController';

const router = Router();

router.get('/courses', getStudentCourses);
router.get('/courses/:courseSlug', getStudentCourseDetails);
router.get('/lessons/:lessonSlug', getStudentLesson);

export default router;

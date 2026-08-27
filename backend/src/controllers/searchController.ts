import { Request, Response, NextFunction } from 'express';
import Course from '../models/Course';
import Module from '../models/Module';
import Lesson from '../models/Lesson';

// GET /search - Search courses, modules, and lessons globally
export const globalSearch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      res.status(200).json({
        success: true,
        data: { courses: [], modules: [], lessons: [] }
      });
      return;
    }

    const searchRegex = { $regex: query, $options: 'i' };

    const coursesPromise = Course.find({ name: searchRegex }).limit(5);
    const modulesPromise = Module.find({ name: searchRegex })
      .populate('courseId', 'name')
      .limit(5);
    const lessonsPromise = Lesson.find({ title: searchRegex })
      .populate({
        path: 'moduleId',
        select: 'name courseId',
        populate: { path: 'courseId', select: 'name' }
      })
      .limit(5);

    const [courses, modules, lessons] = await Promise.all([
      coursesPromise,
      modulesPromise,
      lessonsPromise
    ]);

    res.status(200).json({
      success: true,
      data: {
        courses,
        modules,
        lessons
      }
    });
  } catch (error) {
    next(error);
  }
};

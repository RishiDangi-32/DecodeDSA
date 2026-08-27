import { Request, Response, NextFunction } from 'express';
import Course from '../models/Course';
import Module from '../models/Module';
import Lesson from '../models/Lesson';

// GET /stats - Retrieve dashboard summary statistics
export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalCourses = await Course.countDocuments({});
    const totalModules = await Module.countDocuments({});
    const totalLessons = await Lesson.countDocuments({});
    const publishedLessons = await Lesson.countDocuments({ status: 'published' });
    const draftLessons = await Lesson.countDocuments({ status: 'draft' });

    const recentlyUpdatedLessons = await Lesson.find({})
      .populate({
        path: 'moduleId',
        select: 'name courseId',
        populate: { path: 'courseId', select: 'name' }
      })
      .sort({ updatedAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalCourses,
        totalModules,
        totalLessons,
        publishedLessons,
        draftLessons,
        recentlyUpdatedLessons
      }
    });
  } catch (error) {
    next(error);
  }
};

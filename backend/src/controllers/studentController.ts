import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Course from '../models/Course';
import Module from '../models/Module';
import Lesson from '../models/Lesson';

// GET /student/courses - Get active courses for students
export const getStudentCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courses = await Course.find({ status: 'active' }).sort({ order: 1 });
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    next(error);
  }
};

// GET /student/courses/:courseSlug - Get course, modules, and published lessons
export const getStudentCourseDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseSlug } = req.params;

    const course = await Course.findOne({ slug: courseSlug, status: 'active' });
    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found or is currently inactive.' });
      return;
    }

    // Find active modules in course
    const modules = await Module.find({ courseId: course._id, status: 'active' }).sort({ order: 1 });
    const moduleIds = modules.map(m => m._id);

    // Find published lessons in modules
    const lessons = await Lesson.find({ moduleId: { $in: moduleIds }, status: 'published' }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: {
        course,
        modules,
        lessons
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /student/lessons/:lessonSlug - Get published lesson content
export const getStudentLesson = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lessonSlug } = req.params;

    const query = mongoose.isValidObjectId(lessonSlug)
      ? { _id: lessonSlug, status: 'published' }
      : { slug: lessonSlug, status: 'published' };

    const lesson = await Lesson.findOne(query)
      .populate({
        path: 'moduleId',
        select: 'name courseId',
        populate: { path: 'courseId', select: 'name slug' }
      });

    if (!lesson) {
      res.status(404).json({ success: false, message: 'Lesson not found or is currently a draft.' });
      return;
    }

    res.status(200).json({ success: true, data: lesson });
  } catch (error) {
    next(error);
  }
};

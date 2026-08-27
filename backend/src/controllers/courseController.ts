import { Request, Response, NextFunction } from 'express';
import Course from '../models/Course';
import Module from '../models/Module';
import Lesson from '../models/Lesson';
import slugify from 'slugify';

// GET /courses - Retrieve courses with paging, search, sorting
export const getCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search as string;
    const status = req.query.status as string;
    const sortBy = (req.query.sortBy as string) || 'order';
    const sortOrder = (req.query.sortOrder as string) === 'desc' ? -1 : 1;

    const query: any = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (status) {
      query.status = status;
    }

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: courses,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// POST /courses - Create Course
export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, slug, description, icon, order, status } = req.body;

    if (!name) {
      res.status(400).json({ success: false, message: 'Course Name is required.' });
      return;
    }

    const courseSlug = slug
      ? slugify(slug, { lower: true, strict: true })
      : slugify(name, { lower: true, strict: true });

    // Check duplicate slug
    const existing = await Course.findOne({ slug: courseSlug });
    if (existing) {
      res.status(400).json({ success: false, message: 'Duplicate Slug: A course with this slug already exists.' });
      return;
    }

    const course = new Course({
      name,
      slug: courseSlug,
      description,
      icon,
      order: order || 0,
      status: status || 'active'
    });

    await course.save();

    res.status(201).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

// PUT /courses/:id - Update Course
export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, slug, description, icon, order, status } = req.body;

    const course = await Course.findById(id);
    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found.' });
      return;
    }

    if (name) course.name = name;
    if (description !== undefined) course.description = description;
    if (icon) course.icon = icon;
    if (order !== undefined) course.order = order;
    if (status) course.status = status;

    if (slug) {
      const courseSlug = slugify(slug, { lower: true, strict: true });
      if (courseSlug !== course.slug) {
        const existing = await Course.findOne({ slug: courseSlug });
        if (existing) {
          res.status(400).json({ success: false, message: 'Duplicate Slug: A course with this slug already exists.' });
          return;
        }
        course.slug = courseSlug;
      }
    } else if (name && name !== course.name) {
      // Re-generate slug if name changed and slug not manually passed
      const courseSlug = slugify(name, { lower: true, strict: true });
      if (courseSlug !== course.slug) {
        const existing = await Course.findOne({ slug: courseSlug });
        if (!existing) {
          course.slug = courseSlug;
        }
      }
    }

    await course.save();

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

// DELETE /courses/:id - Delete Course (Cascade deletes associated modules & lessons)
export const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found.' });
      return;
    }

    // Find all modules in this course
    const modules = await Module.find({ courseId: id });
    const moduleIds = modules.map(m => m._id);

    // Delete lessons belonging to modules in this course
    await Lesson.deleteMany({ moduleId: { $in: moduleIds } });

    // Delete modules in this course
    await Module.deleteMany({ courseId: id });

    // Delete the course
    await Course.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Course and all associated modules and lessons deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

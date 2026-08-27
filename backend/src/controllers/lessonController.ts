import { Request, Response, NextFunction } from 'express';
import Lesson from '../models/Lesson';
import Module from '../models/Module';
import slugify from 'slugify';

// GET /lessons - Retrieve lessons with query filters, paging, search
export const getLessons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const moduleId = req.query.moduleId as string;
    const courseId = req.query.courseId as string;
    const search = req.query.search as string;
    const status = req.query.status as string;

    const query: any = {};

    if (moduleId) {
      query.moduleId = moduleId;
    } else if (courseId) {
      // Find modules belonging to the course
      const modules = await Module.find({ courseId });
      const moduleIds = modules.map(m => m._id);
      query.moduleId = { $in: moduleIds };
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (status) {
      query.status = status;
    }

    const total = await Lesson.countDocuments(query);
    const lessons = await Lesson.find(query)
      .populate({
        path: 'moduleId',
        select: 'name courseId',
        populate: { path: 'courseId', select: 'name' }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: lessons,
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

// GET /lessons/:slug - Retrieve Lesson by Slug
export const getLessonBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const lesson = await Lesson.findOne({ slug }).populate({
      path: 'moduleId',
      select: 'name courseId',
      populate: { path: 'courseId', select: 'name' }
    });

    if (!lesson) {
      res.status(404).json({ success: false, message: 'Lesson not found.' });
      return;
    }

    res.status(200).json({ success: true, data: lesson });
  } catch (error) {
    next(error);
  }
};

// POST /lessons - Create Lesson
export const createLesson = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { moduleId, title, slug, shortDescription, content, featuredImage, status } = req.body;

    if (!moduleId) {
      res.status(400).json({ success: false, message: 'Module ID is required.' });
      return;
    }
    if (!title) {
      res.status(400).json({ success: false, message: 'Lesson Title is required.' });
      return;
    }
    if (!content) {
      res.status(400).json({ success: false, message: 'Lesson Content is required.' });
      return;
    }

    const lessonSlug = slug
      ? slugify(slug, { lower: true, strict: true })
      : slugify(title, { lower: true, strict: true });

    // Check duplicate slug
    const existing = await Lesson.findOne({ slug: lessonSlug });
    if (existing) {
      res.status(400).json({ success: false, message: 'Duplicate Slug: A lesson with this slug already exists.' });
      return;
    }

    const lesson = new Lesson({
      moduleId,
      title,
      slug: lessonSlug,
      shortDescription,
      content,
      featuredImage,
      status: status || 'draft'
    });

    await lesson.save();

    res.status(201).json({ success: true, data: lesson });
  } catch (error) {
    next(error);
  }
};

// PUT /lessons/:id - Update Lesson
export const updateLesson = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { moduleId, title, slug, shortDescription, content, featuredImage, status } = req.body;

    const lesson = await Lesson.findById(id);
    if (!lesson) {
      res.status(404).json({ success: false, message: 'Lesson not found.' });
      return;
    }

    if (moduleId) lesson.moduleId = moduleId;
    if (title) lesson.title = title;
    if (shortDescription !== undefined) lesson.shortDescription = shortDescription;
    if (content) lesson.content = content;
    if (featuredImage !== undefined) lesson.featuredImage = featuredImage;
    if (status) lesson.status = status;

    if (slug) {
      const lessonSlug = slugify(slug, { lower: true, strict: true });
      if (lessonSlug !== lesson.slug) {
        const existing = await Lesson.findOne({ slug: lessonSlug });
        if (existing) {
          res.status(400).json({ success: false, message: 'Duplicate Slug: A lesson with this slug already exists.' });
          return;
        }
        lesson.slug = lessonSlug;
      }
    } else if (title && title !== lesson.title) {
      const lessonSlug = slugify(title, { lower: true, strict: true });
      if (lessonSlug !== lesson.slug) {
        const existing = await Lesson.findOne({ slug: lessonSlug });
        if (!existing) {
          lesson.slug = lessonSlug;
        }
      }
    }

    await lesson.save();

    res.status(200).json({ success: true, data: lesson });
  } catch (error) {
    next(error);
  }
};

// DELETE /lessons/:id - Delete Lesson
export const deleteLesson = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      res.status(404).json({ success: false, message: 'Lesson not found.' });
      return;
    }

    await Lesson.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Lesson deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

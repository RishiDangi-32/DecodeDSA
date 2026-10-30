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
    const { moduleId, title, content, simulationHtml, youtubeUrl, practiceQuestions, status } = req.body;

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

    const lesson = new Lesson({
      moduleId,
      title,
      content,
      simulationHtml: (simulationHtml && typeof simulationHtml === 'string' && simulationHtml.trim()) ? simulationHtml.trim() : undefined,
      youtubeUrl: (youtubeUrl && typeof youtubeUrl === 'string' && youtubeUrl.trim()) ? youtubeUrl.trim() : undefined,
      practiceQuestions: Array.isArray(practiceQuestions) ? practiceQuestions : [],
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
    const { moduleId, title, content, simulationHtml, youtubeUrl, practiceQuestions, status } = req.body;

    const lesson = await Lesson.findById(id);
    if (!lesson) {
      res.status(404).json({ success: false, message: 'Lesson not found.' });
      return;
    }

    const unsetFields: Record<string, 1> = { slug: 1, shortDescription: 1, featuredImage: 1 };

    if (moduleId) lesson.moduleId = moduleId;
    if (title) lesson.title = title;
    if (content) lesson.content = content;
    if (status) lesson.status = status;

    if (simulationHtml !== undefined) {
      if (simulationHtml && typeof simulationHtml === 'string' && simulationHtml.trim()) {
        lesson.simulationHtml = simulationHtml.trim();
      } else {
        lesson.simulationHtml = undefined;
        unsetFields.simulationHtml = 1;
      }
    }

    if (youtubeUrl !== undefined) {
      if (youtubeUrl && typeof youtubeUrl === 'string' && youtubeUrl.trim()) {
        lesson.youtubeUrl = youtubeUrl.trim();
      } else {
        lesson.youtubeUrl = undefined;
        unsetFields.youtubeUrl = 1;
      }
    }

    if (practiceQuestions !== undefined) {
      lesson.practiceQuestions = Array.isArray(practiceQuestions) ? (practiceQuestions as any) : [];
      lesson.markModified('practiceQuestions');
    }

    await lesson.save();

    // Ensure removed fields are unset in the database document
    await Lesson.updateOne(
      { _id: id },
      { $unset: unsetFields }
    );

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

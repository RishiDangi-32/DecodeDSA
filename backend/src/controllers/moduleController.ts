import { Request, Response, NextFunction } from 'express';
import Module from '../models/Module';
import Lesson from '../models/Lesson';
import slugify from 'slugify';

// GET /modules - Retrieve modules
export const getModules = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courseId = req.query.courseId as string;
    const search = req.query.search as string;

    const query: any = {};
    if (courseId) {
      query.courseId = courseId;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const modules = await Module.find(query).sort({ order: 1, createdAt: 1 });

    res.status(200).json({ success: true, data: modules });
  } catch (error) {
    next(error);
  }
};

// POST /modules - Create Module
export const createModule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId, name, slug, description, order, status } = req.body;

    if (!courseId) {
      res.status(400).json({ success: false, message: 'Course ID is required.' });
      return;
    }
    if (!name) {
      res.status(400).json({ success: false, message: 'Module Name is required.' });
      return;
    }

    const moduleSlug = slug
      ? slugify(slug, { lower: true, strict: true })
      : slugify(name, { lower: true, strict: true });

    // Check duplicate slug
    const existing = await Module.findOne({ slug: moduleSlug });
    if (existing) {
      res.status(400).json({ success: false, message: 'Duplicate Slug: A module with this slug already exists.' });
      return;
    }

    const moduleItem = new Module({
      courseId,
      name,
      slug: moduleSlug,
      description,
      order: order || 0,
      status: status || 'active'
    });

    await moduleItem.save();

    res.status(201).json({ success: true, data: moduleItem });
  } catch (error) {
    next(error);
  }
};

// PUT /modules/:id - Update Module
export const updateModule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, slug, description, order, status } = req.body;

    const moduleItem = await Module.findById(id);
    if (!moduleItem) {
      res.status(404).json({ success: false, message: 'Module not found.' });
      return;
    }

    if (name) moduleItem.name = name;
    if (description !== undefined) moduleItem.description = description;
    if (order !== undefined) moduleItem.order = order;
    if (status) moduleItem.status = status;

    if (slug) {
      const moduleSlug = slugify(slug, { lower: true, strict: true });
      if (moduleSlug !== moduleItem.slug) {
        const existing = await Module.findOne({ slug: moduleSlug });
        if (existing) {
          res.status(400).json({ success: false, message: 'Duplicate Slug: A module with this slug already exists.' });
          return;
        }
        moduleItem.slug = moduleSlug;
      }
    } else if (name && name !== moduleItem.name) {
      const moduleSlug = slugify(name, { lower: true, strict: true });
      if (moduleSlug !== moduleItem.slug) {
        const existing = await Module.findOne({ slug: moduleSlug });
        if (!existing) {
          moduleItem.slug = moduleSlug;
        }
      }
    }

    await moduleItem.save();

    res.status(200).json({ success: true, data: moduleItem });
  } catch (error) {
    next(error);
  }
};

// DELETE /modules/:id - Delete Module (Cascade deletes associated lessons)
export const deleteModule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const moduleItem = await Module.findById(id);
    if (!moduleItem) {
      res.status(404).json({ success: false, message: 'Module not found.' });
      return;
    }

    // Delete all lessons under this module
    await Lesson.deleteMany({ moduleId: id });

    // Delete the module
    await Module.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Module and all associated lessons deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// PUT /modules/reorder - Bulk Reorder Modules (production-ready)
export const reorderModules = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orders } = req.body; // Expecting array of { id: string, order: number }

    if (!Array.isArray(orders)) {
      res.status(400).json({ success: false, message: 'Orders must be an array of objects containing id and order.' });
      return;
    }

    const bulkOperations = orders.map((item: { id: string; order: number }) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order }
      }
    }));

    await Module.bulkWrite(bulkOperations);

    res.status(200).json({ success: true, message: 'Modules reordered successfully.' });
  } catch (error) {
    next(error);
  }
};

import { Request, Response, NextFunction } from 'express';
import Media from '../models/Media';
import cloudinary from '../config/cloudinary';

// GET /media - Retrieve media assets
export const getMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const folder = req.query.folder as string;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (folder && folder !== 'all') {
      query.folder = folder;
    }

    const total = await Media.countDocuments(query);
    const media = await Media.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: media,
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

// POST /media/upload - Upload file to Cloudinary
export const uploadMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded.' });
      return;
    }

    // Determine target folder to prevent merging images across different courses
    const targetFolder = (req.body.folder || req.query.folder || 'general').trim().replace(/[^a-zA-Z0-9_-]/g, '-');
    const cloudinaryFolder = `dsaverse/${targetFolder}`;

    // Upload stream to Cloudinary
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: cloudinaryFolder,
        resource_type: 'auto'
      },
      async (error, result) => {
        if (error || !result) {
          return res.status(500).json({
            success: false,
            message: 'Image upload to Cloudinary failed. Please check your Cloudinary credentials in .env.',
            error
          });
        }

        const media = new Media({
          url: result.secure_url,
          publicId: result.public_id,
          filename: req.file!.originalname,
          size: req.file!.size,
          mimeType: req.file!.mimetype,
          folder: targetFolder
        });

        await media.save();

        return res.status(201).json({
          success: true,
          data: media
        });
      }
    );

    stream.end(req.file.buffer);
  } catch (error) {
    next(error);
  }
};

// DELETE /media/:id - Delete media from Cloudinary and database
export const deleteMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const media = await Media.findById(id);

    if (!media) {
      res.status(404).json({ success: false, message: 'Media asset not found.' });
      return;
    }

    // Destroy Cloudinary asset
    await cloudinary.uploader.destroy(media.publicId);

    // Delete record from DB
    await Media.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Media asset deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

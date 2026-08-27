import { Router } from 'express';
import { getMedia, uploadMedia, deleteMedia } from '../controllers/mediaController';
import { uploadMiddleware } from '../middleware/uploadMiddleware';

const router = Router();

router.get('/', getMedia);
router.post('/upload', uploadMiddleware.single('image'), uploadMedia);
router.delete('/:id', deleteMedia);

export default router;

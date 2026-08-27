import path from 'path';
import dotenv from 'dotenv';
import dns from 'dns';

// Overrides local/ISP DNS with Google's public DNS servers to resolve Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  console.warn('Unable to override DNS servers programmatically.');
}

// Load environmental variables immediately before importing anything else
dotenv.config(); // default cwd
dotenv.config({ path: path.resolve(__dirname, '../.env') }); // fallback to backend/.env
dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // fallback to root .env

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';

import courseRoutes from './routes/courseRoutes';
import moduleRoutes from './routes/moduleRoutes';
import lessonRoutes from './routes/lessonRoutes';
import mediaRoutes from './routes/mediaRoutes';
import statsRoutes from './routes/statsRoutes';
import searchRoutes from './routes/searchRoutes';
import studentRoutes from './routes/studentRoutes';

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Route definitions
app.use('/api/courses', courseRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/student', studentRoutes);

// Base route checker
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

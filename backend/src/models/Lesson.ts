import { Schema, model, Document, Types } from 'mongoose';

export interface ILesson extends Document {
  moduleId: Types.ObjectId;
  title: string;
  slug: string;
  shortDescription?: string;
  content: any; // Tiptap JSON structured node object
  featuredImage?: string;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>(
  {
    moduleId: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String },
    content: { type: Schema.Types.Mixed, required: true },
    featuredImage: { type: String },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' }
  },
  { timestamps: true }
);

export default model<ILesson>('Lesson', LessonSchema);

import { Schema, model, Document } from 'mongoose';

export interface ICourse extends Document {
  name: string;
  slug: string;
  description?: string;
  icon: string;
  order: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    icon: { type: String, default: 'BookOpen' },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
  },
  { timestamps: true }
);

export default model<ICourse>('Course', CourseSchema);

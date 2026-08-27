import { Schema, model, Document, Types } from 'mongoose';

export interface IModule extends Document {
  courseId: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  order: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const ModuleSchema = new Schema<IModule>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
  },
  { timestamps: true }
);

export default model<IModule>('Module', ModuleSchema);

import { Schema, model, Document, Types } from 'mongoose';

export interface IPracticeQuestion {
  _id?: Types.ObjectId;
  type: 'mcq' | 'short_answer';
  question: string;
  image?: string; // Optional screenshot / diagram
  options?: string[];
  correctAnswer: any; // index number (for mcq) or string (for short_answer)
  explanation?: string;
}

export interface ILesson extends Document {
  moduleId: Types.ObjectId;
  title: string;
  slug?: string;
  shortDescription?: string;
  content: any; // Tiptap JSON structured node object
  simulationHtml?: string; // Raw HTML/JS simulation code rendered inside an iframe
  youtubeUrl?: string; // YouTube video tutorial link
  practiceQuestions?: IPracticeQuestion[];
  featuredImage?: string;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

const PracticeQuestionSchema = new Schema(
  {
    type: { type: String, enum: ['mcq', 'short_answer'], default: 'mcq' },
    question: { type: String, required: true, trim: true },
    image: { type: String, trim: true },
    options: [{ type: String, trim: true }],
    correctAnswer: { type: Schema.Types.Mixed, required: true },
    explanation: { type: String, trim: true }
  },
  { _id: true }
);

const LessonSchema = new Schema<ILesson>(
  {
    moduleId: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
    title: { type: String, required: true, trim: true },
    content: { type: Schema.Types.Mixed, required: true },
    simulationHtml: { type: String },
    youtubeUrl: { type: String, trim: true },
    practiceQuestions: [PracticeQuestionSchema],
    status: { type: String, enum: ['draft', 'published'], default: 'draft' }
  },
  { timestamps: true }
);

export default model<ILesson>('Lesson', LessonSchema);

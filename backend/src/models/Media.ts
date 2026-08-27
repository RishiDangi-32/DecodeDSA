import { Schema, model, Document } from 'mongoose';

export interface IMedia extends Document {
  url: string;
  publicId: string;
  filename: string;
  size: number;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true, unique: true },
    filename: { type: String, required: true },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true }
  },
  { timestamps: true }
);

export default model<IMedia>('Media', MediaSchema);

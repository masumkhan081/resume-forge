import { Schema, Types, model, models, type Model } from 'mongoose';
import type { ResumeDraft, ResumeTemplateId } from '@/lib/types/resume';

export type ResumeDoc = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  template: ResumeTemplateId;
  data: ResumeDraft;
  createdAt: Date;
  updatedAt: Date;
};

const resumeSchema = new Schema<ResumeDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    template: { type: String, required: true, default: 'classic-teal' },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true, collection: 'resumes' },
);

resumeSchema.index({ userId: 1, updatedAt: -1 });

export const Resume: Model<ResumeDoc> =
  (models.Resume as Model<ResumeDoc>) ?? model<ResumeDoc>('Resume', resumeSchema);

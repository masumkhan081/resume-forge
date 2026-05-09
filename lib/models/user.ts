import { Schema, Types, model, models, type Model } from 'mongoose';

export type UserDoc = {
  _id: Types.ObjectId;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  passwordHash: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new Schema<UserDoc>(
  {
    name: { type: String, default: null, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    emailVerified: { type: Date, default: null },
    image: { type: String, default: null },
    passwordHash: { type: String, default: null },
  },
  { timestamps: true, collection: 'users' },
);

export const User: Model<UserDoc> =
  (models.User as Model<UserDoc>) ?? model<UserDoc>('User', userSchema);

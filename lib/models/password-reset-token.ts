import { Schema, Types, model, models, type Model } from 'mongoose';

export type PasswordResetTokenDoc = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

const passwordResetTokenSchema = new Schema<PasswordResetTokenDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 },
    },
  },
  { timestamps: true, collection: 'password_reset_tokens' },
);

export const PasswordResetToken: Model<PasswordResetTokenDoc> =
  (models.PasswordResetToken as Model<PasswordResetTokenDoc>) ??
  model<PasswordResetTokenDoc>('PasswordResetToken', passwordResetTokenSchema);

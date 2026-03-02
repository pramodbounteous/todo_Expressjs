import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAuthDocument extends Document {
  user: Types.ObjectId;
  refreshToken: string;
  expiresAt: Date;
}

const authSchema = new Schema<IAuthDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Optional: auto-delete expired refresh tokens
authSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Auth = mongoose.model<IAuthDocument>("Auth", authSchema);
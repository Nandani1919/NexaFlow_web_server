import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false },
    type: { type: String, enum: ["task", "project", "team", "system"], default: "system" },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        ret.userId = ret.userId ? ret.userId.toString() : undefined;
        ret.createdAt = ret.createdAt?.toISOString();
        delete ret._id;
        delete ret.updatedAt;
      },
    },
  },
);

export const Notification = mongoose.model("Notification", notificationSchema);

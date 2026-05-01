import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true, trim: true },
    target: { type: String, required: true, trim: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", default: null },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        ret.userId = ret.userId?.toString();
        ret.projectId = ret.projectId ? ret.projectId.toString() : undefined;
        ret.createdAt = ret.createdAt?.toISOString();
        delete ret._id;
        delete ret.updatedAt;
      },
    },
  },
);

export const Activity = mongoose.model("Activity", activitySchema);

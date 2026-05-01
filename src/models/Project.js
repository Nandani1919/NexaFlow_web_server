import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    status: { type: String, enum: ["planning", "active", "on_hold", "completed"], default: "planning" },
    priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
    dueDate: { type: Date, required: true },
    memberIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    color: { type: String, required: true },
    emoji: { type: String, default: "O" },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        ret.ownerId = ret.ownerId?.toString();
        ret.memberIds = (ret.memberIds || []).map((id) => id.toString());
        ret.createdAt = ret.createdAt?.toISOString();
        ret.dueDate = ret.dueDate?.toISOString();
        delete ret._id;
        delete ret.updatedAt;
      },
    },
  },
);

export const Project = mongoose.model("Project", projectSchema);

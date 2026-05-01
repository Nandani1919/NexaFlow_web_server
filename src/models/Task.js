import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, default: "", trim: true, maxlength: 4000 },
    status: { type: String, enum: ["todo", "in_progress", "in_review", "completed"], default: "todo" },
    priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
    assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    dueDate: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        ret.projectId = ret.projectId?.toString();
        ret.assigneeId = ret.assigneeId ? ret.assigneeId.toString() : undefined;
        ret.createdAt = ret.createdAt?.toISOString();
        ret.dueDate = ret.dueDate ? ret.dueDate.toISOString() : undefined;
        delete ret._id;
        delete ret.updatedAt;
      },
    },
  },
);

export const Task = mongoose.model("Task", taskSchema);

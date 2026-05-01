import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        ret.taskId = ret.taskId?.toString();
        ret.authorId = ret.authorId?.toString();
        ret.createdAt = ret.createdAt?.toISOString();
        delete ret._id;
        delete ret.updatedAt;
      },
    },
  },
);

export const Comment = mongoose.model("Comment", commentSchema);

import { z } from "zod";

export const roleSchema = z.enum(["admin", "member"]);
export const projectStatusSchema = z.enum(["planning", "active", "on_hold", "completed"]);
export const taskStatusSchema = z.enum(["todo", "in_progress", "in_review", "completed"]);
export const prioritySchema = z.enum(["low", "medium", "high", "urgent"]);

export const signupSchema = z.object({
  name: z.string().trim().min(2).max(60),
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(100),
  role: roleSchema.default("admin"),
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(100),
});

export const projectCreateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(2000),
  status: projectStatusSchema.default("planning"),
  priority: prioritySchema.default("medium"),
  dueDate: z.coerce.date(),
  memberIds: z.array(z.string()).default([]),
  ownerId: z.string().optional(),
  color: z.string().trim().min(1),
  emoji: z.string().trim().default("O"),
});

export const projectUpdateSchema = projectCreateSchema.partial();

export const taskCreateSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(4000).optional().default(""),
  status: taskStatusSchema.default("todo"),
  priority: prioritySchema.default("medium"),
  assigneeId: z.string().optional().nullable(),
  dueDate: z.coerce.date().optional().nullable(),
});

export const taskUpdateSchema = taskCreateSchema.partial();

export const commentCreateSchema = z.object({
  text: z.string().trim().min(1).max(2000),
});

export const memberInviteSchema = z.object({
  name: z.string().trim().min(2).max(60),
  email: z.string().trim().email().max(255),
  role: roleSchema.default("member"),
});

export const memberRoleSchema = z.object({
  role: roleSchema,
});

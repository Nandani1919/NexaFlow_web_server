import { Activity } from "../models/Activity.js";
import { Notification } from "../models/Notification.js";
import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";

const colors = [
  "from-violet-500 to-fuchsia-500",
  "from-sky-500 to-cyan-400",
  "from-emerald-500 to-teal-400",
  "from-orange-500 to-amber-400",
  "from-pink-500 to-rose-400",
  "from-indigo-500 to-blue-400",
  "from-lime-500 to-green-400",
];

function daysFromNow(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

export async function seedDatabase() {
  const existingUsers = await User.estimatedDocumentCount();
  const passwordHash = await User.hashPassword("demo1234");

  if (existingUsers > 0) {
    await Promise.all([
      { name: "Alex Morgan", email: "alex@nexaflow.app", role: "admin", color: colors[0] },
      { name: "Jamie Chen", email: "jamie@nexaflow.app", role: "member", color: colors[1] },
    ].map((user) =>
      User.updateOne(
        { email: user.email },
        {
          $setOnInsert: {
            ...user,
            passwordHash,
          },
        },
        { upsert: true },
      ),
    ));
    return;
  }

  const users = await User.insertMany([
    { name: "Alex Morgan", email: "alex@nexaflow.app", role: "admin", color: colors[0], passwordHash },
    { name: "Jamie Chen", email: "jamie@nexaflow.app", role: "member", color: colors[1], passwordHash },
    { name: "Priya Patel", email: "priya@nexaflow.app", role: "member", color: colors[2], passwordHash },
    { name: "Marcus Lee", email: "marcus@nexaflow.app", role: "member", color: colors[3], passwordHash },
    { name: "Sofia Rossi", email: "sofia@nexaflow.app", role: "admin", color: colors[4], passwordHash },
    { name: "Liam O'Brien", email: "liam@nexaflow.app", role: "member", color: colors[5], passwordHash },
    { name: "Yuki Tanaka", email: "yuki@nexaflow.app", role: "member", color: colors[6], passwordHash },
  ]);

  const [alex, jamie, priya, marcus, sofia, liam, yuki] = users;
  const projects = await Project.insertMany([
    {
      name: "Apollo Mobile App",
      description: "Cross-platform mobile rebuild with a new design system and offline-first architecture.",
      status: "active",
      priority: "high",
      dueDate: daysFromNow(18),
      memberIds: [alex.id, jamie.id, priya.id, marcus.id],
      ownerId: alex.id,
      color: "from-violet-500 to-fuchsia-500",
      emoji: "A",
    },
    {
      name: "Brand Refresh 2026",
      description: "New logo, marketing site, and brand guidelines rollout across all touchpoints.",
      status: "active",
      priority: "medium",
      dueDate: daysFromNow(34),
      memberIds: [sofia.id, priya.id, liam.id],
      ownerId: sofia.id,
      color: "from-pink-500 to-rose-500",
      emoji: "B",
    },
    {
      name: "Data Platform v2",
      description: "Migrate analytics pipelines to streaming architecture with real-time dashboards.",
      status: "planning",
      priority: "urgent",
      dueDate: daysFromNow(60),
      memberIds: [alex.id, marcus.id, yuki.id],
      ownerId: alex.id,
      color: "from-sky-500 to-cyan-500",
      emoji: "D",
    },
    {
      name: "Customer Onboarding",
      description: "Redesigned activation flow with interactive walkthroughs and contextual tips.",
      status: "active",
      priority: "high",
      dueDate: daysFromNow(7),
      memberIds: [jamie.id, priya.id, sofia.id],
      ownerId: sofia.id,
      color: "from-emerald-500 to-teal-500",
      emoji: "C",
    },
  ]);

  const titles = [
    "Design system tokens audit",
    "Implement OAuth providers",
    "Refactor data layer",
    "Write E2E tests",
    "User research interviews",
    "Create landing page hero",
    "Wire up notifications",
    "Add dark mode support",
    "Optimize bundle size",
    "Set up CI/CD pipeline",
    "Migration plan for v2 API",
    "Performance benchmark report",
  ];
  const statuses = ["todo", "in_progress", "in_review", "completed"];
  const priorities = ["low", "medium", "high", "urgent"];

  const tasks = await Task.insertMany(
    titles.map((title, index) => {
      const project = projects[index % projects.length];
      const members = project.memberIds;
      return {
        projectId: project.id,
        title,
        description: "Detailed scope and acceptance criteria to keep the team aligned.",
        status: statuses[index % statuses.length],
        priority: priorities[(index + 1) % priorities.length],
        assigneeId: members[index % members.length],
        dueDate: daysFromNow(((index % 14) - 3) * 2),
      };
    }),
  );

  await Activity.insertMany([
    { userId: jamie.id, action: "completed task", target: tasks[1].title, projectId: projects[0].id },
    { userId: priya.id, action: "commented on", target: tasks[4].title, projectId: projects[3].id },
    { userId: alex.id, action: "created project", target: projects[2].name, projectId: projects[2].id },
  ]);

  await Notification.insertMany([
    { title: "Task assigned to you", description: "Sofia assigned 'Wire up notifications' to you", read: false, type: "task" },
    { title: "Deadline approaching", description: "Apollo Mobile App is due soon", read: false, type: "project" },
    { title: "New comment", description: "Priya commented on a task", read: true, type: "task" },
  ]);
}

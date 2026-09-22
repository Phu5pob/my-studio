import {
  pgTable, text, integer, real, boolean, serial, timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------- Branches ----------
export const branches = pgTable("branches", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  description: text("description").default(""),
  imageUrl: text("image_url").default(""),
  createdAt: timestamp("created_at").defaultNow(),
});

// ---------- Users ----------
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").$type<"admin" | "teacher" | "student">().notNull().default("student"),
  phone: text("phone").default(""),
  branchId: integer("branch_id").references(() => branches.id, { onDelete: "set null" }),
  avatarUrl: text("avatar_url").default(""),
  education: text("education").default(""),
  experience: text("experience").default(""),
  instruments: text("instruments").default(""),
  position: text("position").default(""),
  createdAt: timestamp("created_at").defaultNow(),
});

// ---------- Courses ----------
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  branchId: integer("branch_id").notNull().references(() => branches.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  instrument: text("instrument").notNull(),
  level: text("level").$type<"beginner" | "intermediate" | "advanced">().notNull().default("beginner"),
  description: text("description").default(""),
  price: real("price").notNull().default(0),
  durationWeeks: integer("duration_weeks").notNull().default(12),
  imageUrl: text("image_url").default(""),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// ---------- Rooms ----------
export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  branchId: integer("branch_id").notNull().references(() => branches.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  capacity: integer("capacity").notNull().default(1),
  description: text("description").default(""),
});

// ---------- Schedules ----------
export const schedules = pgTable("schedules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  teacherId: integer("teacher_id").references(() => users.id, { onDelete: "set null" }),
  roomId: integer("room_id").references(() => rooms.id, { onDelete: "set null" }),
  dayOfWeek: integer("day_of_week").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  maxStudents: integer("max_students").notNull().default(8),
});

// ---------- Enrollments ----------
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  scheduleId: integer("schedule_id").references(() => schedules.id, { onDelete: "set null" }),
  status: text("status").$type<"pending" | "confirmed" | "cancelled" | "completed">().notNull().default("pending"),
  note: text("note").default(""),
  createdAt: timestamp("created_at").defaultNow(),
});

// ---------- Payments ----------
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  enrollmentId: integer("enrollment_id").references(() => enrollments.id, { onDelete: "set null" }),
  invoiceNo: text("invoice_no").notNull().unique(),
  amount: real("amount").notNull(),
  method: text("method").$type<"bank_transfer" | "credit_card" | "cash" | "promptpay">().notNull().default("bank_transfer"),
  status: text("status").$type<"pending" | "paid" | "failed" | "refunded">().notNull().default("pending"),
  slipUrl: text("slip_url").default(""),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ---------- Progress ----------
export const progressRecords = pgTable("progress_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  teacherId: integer("teacher_id").references(() => users.id, { onDelete: "set null" }),
  term: text("term").notNull(),
  score: integer("score"),
  skillLevel: text("skill_level").default(""),
  teacherComment: text("teacher_comment").default(""),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

// ---------- Articles ----------
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").default(""),
  content: text("content").notNull(),
  coverImage: text("cover_image").default(""),
  branchId: integer("branch_id").references(() => branches.id, { onDelete: "set null" }),
  authorId: integer("author_id").references(() => users.id, { onDelete: "set null" }),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ---------- Relations ----------
export const branchesRelations = relations(branches, ({ many }) => ({
  users: many(users), courses: many(courses), articles: many(articles), rooms: many(rooms),
}));
export const usersRelations = relations(users, ({ one, many }) => ({
  branch: one(branches, { fields: [users.branchId], references: [branches.id] }),
  enrollments: many(enrollments), payments: many(payments), progressRecords: many(progressRecords),
  taughtSchedules: many(schedules, { relationName: "teacherSchedules" }),
}));
export const roomsRelations = relations(rooms, ({ one, many }) => ({
  branch: one(branches, { fields: [rooms.branchId], references: [branches.id] }),
  schedules: many(schedules),
}));
export const coursesRelations = relations(courses, ({ one, many }) => ({
  branch: one(branches, { fields: [courses.branchId], references: [branches.id] }),
  schedules: many(schedules), enrollments: many(enrollments), progressRecords: many(progressRecords),
}));
export const schedulesRelations = relations(schedules, ({ one, many }) => ({
  course: one(courses, { fields: [schedules.courseId], references: [courses.id] }),
  teacher: one(users, { fields: [schedules.teacherId], references: [users.id], relationName: "teacherSchedules" }),
  room: one(rooms, { fields: [schedules.roomId], references: [rooms.id] }),
  enrollments: many(enrollments),
}));
export const enrollmentsRelations = relations(enrollments, ({ one, many }) => ({
  user: one(users, { fields: [enrollments.userId], references: [users.id] }),
  course: one(courses, { fields: [enrollments.courseId], references: [courses.id] }),
  schedule: one(schedules, { fields: [enrollments.scheduleId], references: [schedules.id] }),
  payments: many(payments),
}));
export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, { fields: [payments.userId], references: [users.id] }),
  enrollment: one(enrollments, { fields: [payments.enrollmentId], references: [enrollments.id] }),
}));
export const progressRelations = relations(progressRecords, ({ one }) => ({
  user: one(users, { fields: [progressRecords.userId], references: [users.id] }),
  course: one(courses, { fields: [progressRecords.courseId], references: [courses.id] }),
  teacher: one(users, { fields: [progressRecords.teacherId], references: [users.id], relationName: "teacherProgress" }),
}));
export const articlesRelations = relations(articles, ({ one }) => ({
  branch: one(branches, { fields: [articles.branchId], references: [branches.id] }),
  author: one(users, { fields: [articles.authorId], references: [users.id] }),
}));

import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  fullName: text("full_name").notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Export types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Create Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const scenarios = pgTable("scenarios", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  data: text("data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  type: text("type").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// New annotations table
export const annotations = pgTable("annotations", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").references(() => documents.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  position: jsonb("position"), // Stores coordinates/position of annotation in document
  type: text("type").notNull(), // 'highlight', 'comment', 'drawing', etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  parentId: integer("parent_id").references(() => annotations.id), // For threaded comments
  metadata: jsonb("metadata") // Additional annotation data (color, drawing paths, etc.)
});

// New comment replies table for threaded discussions
export const annotationReplies = pgTable("annotation_replies", {
  id: serial("id").primaryKey(),
  annotationId: integer("annotation_id").references(() => annotations.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export type Scenario = typeof scenarios.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type Annotation = typeof annotations.$inferSelect;
export type AnnotationReply = typeof annotationReplies.$inferSelect;

export const insertAnnotationSchema = createInsertSchema(annotations);
export const selectAnnotationSchema = createSelectSchema(annotations);
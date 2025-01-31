import { pgTable, text, serial, integer, boolean, timestamp, jsonb, date, decimal } from "drizzle-orm/pg-core";
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

// Database components table
export const databaseComponents = pgTable("database_components", {
  id: serial("id").primaryKey(),
  assetId: integer("asset_id").notNull(),
  componentName: text("component_name").notNull(),
  groupFacility: text("group_facility"),
  category: text("category"),
  imageUrl: text("image_url"),
  usefulLife: integer("useful_life"),
  lifeRange: text("life_range"),
  effectiveDate: date("effective_date"),
  resource: text("resource"),
  quantity: decimal("quantity"),
  unit: text("unit"),
  salvage: decimal("salvage"),
  unitCost: decimal("unit_cost"),
  standard1: text("standard1"), 
  standard2: text("standard2"), 
  standard3: text("standard3"),
  standard4: text("standard4"),
  standard5: text("standard5"),
  replacementPercentage: integer("replacement_percentage"),
  comments: text("comments"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Export types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type DatabaseComponent = typeof databaseComponents.$inferSelect;
export type NewDatabaseComponent = typeof databaseComponents.$inferInsert;

// Create Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertDatabaseComponentSchema = createInsertSchema(databaseComponents);
export const selectDatabaseComponentSchema = createSelectSchema(databaseComponents);

// Keep existing tables below
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

export const annotations = pgTable("annotations", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").references(() => documents.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  position: jsonb("position"),
  type: text("type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  parentId: integer("parent_id").references(() => annotations.id),
  metadata: jsonb("metadata")
});

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
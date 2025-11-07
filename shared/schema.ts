import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, index, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Grant application status enum
export const GrantApplicationStatusEnum = z.enum(["received", "in-review", "granted", "rejected"]);
export type GrantApplicationStatus = z.infer<typeof GrantApplicationStatusEnum>;

export const emailSubscriptions = pgTable("email_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
});

export const grantApplications = pgTable("grant_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicantName: text("applicant_name").notNull(),
  email: text("email").notNull(),
  organization: text("organization"),
  grantCategory: text("grant_category").notNull(),
  projectTitle: text("project_title").notNull(),
  fundingAmount: text("funding_amount").notNull(),
  projectDescription: text("project_description").notNull(),
  technicalDetails: text("technical_details").notNull(),
  timeline: text("timeline").notNull(),
  teamExperience: text("team_experience").notNull(),
  githubRepo: text("github_repo"),
  additionalInfo: text("additional_info"),
  status: text("status").notNull().default("received"),
  publicChatToken: varchar("public_chat_token").notNull().unique().default(sql`gen_random_uuid()`),
  lastAdminViewedAt: timestamp("last_admin_viewed_at"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().references(() => grantApplications.id, { onDelete: 'cascade' }),
  senderRole: text("sender_role").notNull(),
  senderId: text("sender_id"),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const grantCategories = pgTable("grant_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  icon: text("icon").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const grants = pgTable("grants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").notNull().references(() => grantCategories.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  amount: text("amount").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").array().notNull(),
  deadline: text("deadline").notNull(),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const grantsRelations = relations(grants, ({ one }) => ({
  category: one(grantCategories, {
    fields: [grants.categoryId],
    references: [grantCategories.id],
  }),
}));

export const grantCategoriesRelations = relations(grantCategories, ({ many }) => ({
  grants: many(grants),
}));

export const grantApplicationsRelations = relations(grantApplications, ({ many }) => ({
  chatMessages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  application: one(grantApplications, {
    fields: [chatMessages.applicationId],
    references: [grantApplications.id],
  }),
}));

export const insertEmailSubscriptionSchema = createInsertSchema(emailSubscriptions).pick({
  email: true,
});

export const insertGrantApplicationSchema = createInsertSchema(grantApplications).omit({
  id: true,
  status: true,
  publicChatToken: true,
  lastAdminViewedAt: true,
  submittedAt: true,
});

export const insertGrantCategorySchema = createInsertSchema(grantCategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGrantSchema = createInsertSchema(grants).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
}).partial({ id: true });

export type InsertEmailSubscription = z.infer<typeof insertEmailSubscriptionSchema>;
export type EmailSubscription = typeof emailSubscriptions.$inferSelect;
export type InsertGrantApplication = z.infer<typeof insertGrantApplicationSchema>;
export type GrantApplication = typeof grantApplications.$inferSelect;

export type InsertGrantCategory = z.infer<typeof insertGrantCategorySchema>;
export type GrantCategory = typeof grantCategories.$inferSelect;
export type InsertGrant = z.infer<typeof insertGrantSchema>;
export type Grant = typeof grants.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;

export type GrantApplicationWithUnreadCount = GrantApplication & {
  unreadMessageCount: number;
};

export type NewsPost = {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  thumbnail?: string;
  categories?: string[];
  author: string;
};

export type NewsResponse = {
  posts: NewsPost[];
  total: number;
};

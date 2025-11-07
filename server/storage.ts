import type { 
  InsertEmailSubscription, 
  EmailSubscription, 
  InsertGrantApplication, 
  GrantApplication,
  InsertGrant,
  Grant,
  InsertGrantCategory,
  GrantCategory,
  InsertChatMessage,
  ChatMessage,
  User,
  UpsertUser
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { grants, grantCategories, emailSubscriptions, grantApplications, users, chatMessages } from "@shared/schema";
import { eq, and, gt, count, sql, or } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Email subscriptions
  createEmailSubscription(subscription: InsertEmailSubscription): Promise<EmailSubscription>;
  getEmailSubscription(email: string): Promise<EmailSubscription | undefined>;
  
  // Grant applications
  createGrantApplication(data: InsertGrantApplication): Promise<GrantApplication>;
  getGrantApplications(filter?: {status?: string}): Promise<GrantApplication[]>;
  getGrantApplicationById(id: string): Promise<GrantApplication | undefined>;
  updateGrantApplication(id: string, updates: Partial<Pick<GrantApplication, 'status' | 'lastAdminViewedAt'>>): Promise<GrantApplication>;
  
  // Chat messages
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessagesByApplicationId(applicationId: string): Promise<ChatMessage[]>;
  getChatMessagesByToken(publicChatToken: string): Promise<ChatMessage[]>;
  updateChatMessage(id: string, updates: Pick<ChatMessage, 'body'>): Promise<ChatMessage>;
  deleteChatMessage(id: string): Promise<void>;
  getUnreadMessageCount(applicationId: string): Promise<number>;
  getUnreadMessageCounts(applicationIds: string[]): Promise<Map<string, number>>;
  
  // Grants
  getGrants(): Promise<Grant[]>;
  getGrantById(id: string): Promise<Grant | undefined>;
  createGrant(grant: InsertGrant): Promise<Grant>;
  updateGrant(id: string, grant: Partial<InsertGrant>): Promise<Grant>;
  deleteGrant(id: string): Promise<void>;
  
  // Grant categories
  getGrantCategories(): Promise<GrantCategory[]>;
  createGrantCategory(category: InsertGrantCategory): Promise<GrantCategory>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private emailSubscriptions: Map<string, EmailSubscription>;
  private grantApplications: GrantApplication[] = [];
  private grants: Grant[] = [];
  private grantCategories: GrantCategory[] = [];
  private chatMessages: ChatMessage[] = [];

  constructor() {
    this.emailSubscriptions = new Map();
  }

  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // Check if user already exists
    const existingUser = userData.id ? this.users.get(userData.id) : null;
    
    const user: User = {
      id: userData.id || randomUUID(), // Use provided ID (from Replit) or generate new one
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      isAdmin: userData.isAdmin || false,
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async createEmailSubscription(insertSubscription: InsertEmailSubscription): Promise<EmailSubscription> {
    const id = randomUUID();
    const subscription: EmailSubscription = {
      ...insertSubscription,
      id,
      subscribedAt: new Date(),
    };
    this.emailSubscriptions.set(insertSubscription.email, subscription);
    return subscription;
  }

  async getEmailSubscription(email: string): Promise<EmailSubscription | undefined> {
    return Array.from(this.emailSubscriptions.values()).find(
      (subscription) => subscription.email === email,
    );
  }

  async createGrantApplication(data: InsertGrantApplication): Promise<GrantApplication> {
    const application: GrantApplication = {
      id: randomUUID(),
      ...data,
      organization: data.organization || null,
      githubRepo: data.githubRepo || null,
      additionalInfo: data.additionalInfo || null,
      status: "received",
      publicChatToken: randomUUID(),
      lastAdminViewedAt: null,
      submittedAt: new Date(),
    };

    this.grantApplications.push(application);
    return application;
  }

  async getGrantApplications(filter?: {status?: string}): Promise<GrantApplication[]> {
    let filteredApplications = [...this.grantApplications];
    
    if (filter?.status) {
      filteredApplications = filteredApplications.filter(app => {
        // Handle legacy status mapping: pipeline -> in-review
        const appStatus = app.status === 'pipeline' ? 'in-review' : app.status;
        return appStatus === filter.status;
      });
    }
    
    return filteredApplications;
  }

  async getGrantApplicationById(id: string): Promise<GrantApplication | undefined> {
    return this.grantApplications.find(app => app.id === id);
  }

  async updateGrantApplication(id: string, updates: Partial<Pick<GrantApplication, 'status' | 'lastAdminViewedAt'>>): Promise<GrantApplication> {
    const appIndex = this.grantApplications.findIndex(app => app.id === id);
    if (appIndex === -1) {
      throw new Error(`Grant application with id ${id} not found`);
    }
    
    const updatedApp: GrantApplication = {
      ...this.grantApplications[appIndex],
      ...updates,
    };
    
    this.grantApplications[appIndex] = updatedApp;
    return updatedApp;
  }

  // Chat messages
  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    // Verify that the referenced application exists
    const applicationExists = this.grantApplications.some(app => app.id === insertMessage.applicationId);
    if (!applicationExists) {
      throw new Error(`Grant application with id ${insertMessage.applicationId} not found`);
    }

    const message: ChatMessage = {
      id: randomUUID(),
      ...insertMessage,
      senderId: insertMessage.senderId || null,
      createdAt: new Date(),
    };
    this.chatMessages.push(message);
    return message;
  }

  async getChatMessagesByApplicationId(applicationId: string): Promise<ChatMessage[]> {
    return this.chatMessages
      .filter(msg => msg.applicationId === applicationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getChatMessagesByToken(publicChatToken: string): Promise<ChatMessage[]> {
    // Find the application by token first
    const application = this.grantApplications.find(app => app.publicChatToken === publicChatToken);
    if (!application) {
      return [];
    }
    
    return this.getChatMessagesByApplicationId(application.id);
  }

  async updateChatMessage(id: string, updates: Pick<ChatMessage, 'body'>): Promise<ChatMessage> {
    const messageIndex = this.chatMessages.findIndex(msg => msg.id === id);
    if (messageIndex === -1) {
      throw new Error(`Chat message with id ${id} not found`);
    }
    
    const updatedMessage: ChatMessage = {
      ...this.chatMessages[messageIndex],
      ...updates,
    };
    
    this.chatMessages[messageIndex] = updatedMessage;
    return updatedMessage;
  }

  async deleteChatMessage(id: string): Promise<void> {
    const messageIndex = this.chatMessages.findIndex(msg => msg.id === id);
    if (messageIndex === -1) {
      throw new Error(`Chat message with id ${id} not found`);
    }
    this.chatMessages.splice(messageIndex, 1);
  }

  async getUnreadMessageCount(applicationId: string): Promise<number> {
    const application = this.grantApplications.find(app => app.id === applicationId);
    if (!application) {
      return 0;
    }

    const cutoffTime = application.lastAdminViewedAt;
    return this.chatMessages.filter(msg => 
      msg.applicationId === applicationId &&
      msg.senderRole === 'applicant' &&
      (!cutoffTime || msg.createdAt > cutoffTime)
    ).length;
  }

  async getUnreadMessageCounts(applicationIds: string[]): Promise<Map<string, number>> {
    const counts = new Map<string, number>();
    
    for (const applicationId of applicationIds) {
      const count = await this.getUnreadMessageCount(applicationId);
      counts.set(applicationId, count);
    }
    
    return counts;
  }

  // Grants
  async getGrants(): Promise<Grant[]> {
    return [...this.grants];
  }

  async getGrantById(id: string): Promise<Grant | undefined> {
    return this.grants.find(grant => grant.id === id);
  }

  async createGrant(insertGrant: InsertGrant): Promise<Grant> {
    const grant: Grant = {
      id: randomUUID(),
      ...insertGrant,
      status: insertGrant.status ?? "open",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.grants.push(grant);
    return grant;
  }

  async updateGrant(id: string, updateData: Partial<InsertGrant>): Promise<Grant> {
    const grantIndex = this.grants.findIndex(grant => grant.id === id);
    if (grantIndex === -1) {
      throw new Error(`Grant with id ${id} not found`);
    }
    
    const updatedGrant: Grant = {
      ...this.grants[grantIndex],
      ...updateData,
      updatedAt: new Date(),
    };
    
    this.grants[grantIndex] = updatedGrant;
    return updatedGrant;
  }

  async deleteGrant(id: string): Promise<void> {
    const grantIndex = this.grants.findIndex(grant => grant.id === id);
    if (grantIndex === -1) {
      throw new Error(`Grant with id ${id} not found`);
    }
    this.grants.splice(grantIndex, 1);
  }

  // Grant categories
  async getGrantCategories(): Promise<GrantCategory[]> {
    return [...this.grantCategories];
  }

  async createGrantCategory(insertCategory: InsertGrantCategory): Promise<GrantCategory> {
    const category: GrantCategory = {
      id: randomUUID(),
      ...insertCategory,
      description: insertCategory.description ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.grantCategories.push(category);
    return category;
  }
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
  // Email subscriptions
  async createEmailSubscription(insertSubscription: InsertEmailSubscription): Promise<EmailSubscription> {
    const [subscription] = await db.insert(emailSubscriptions).values(insertSubscription).returning();
    return subscription;
  }

  async getEmailSubscription(email: string): Promise<EmailSubscription | undefined> {
    const [subscription] = await db.select().from(emailSubscriptions).where(eq(emailSubscriptions.email, email));
    return subscription;
  }
  
  // Grant applications
  async createGrantApplication(data: InsertGrantApplication): Promise<GrantApplication> {
    const [application] = await db.insert(grantApplications).values(data).returning();
    return application;
  }

  async getGrantApplications(filter?: {status?: string}): Promise<GrantApplication[]> {
    if (filter?.status) {
      // Handle both current status and legacy status mapping
      let whereConditions;
      if (filter.status === 'in-review') {
        // Match both 'in-review' and legacy 'pipeline' status
        whereConditions = or(
          eq(grantApplications.status, 'in-review'),
          eq(grantApplications.status, 'pipeline')
        );
      } else {
        whereConditions = eq(grantApplications.status, filter.status);
      }
      
      return await db.select().from(grantApplications).where(whereConditions);
    }
    return await db.select().from(grantApplications);
  }

  async getGrantApplicationById(id: string): Promise<GrantApplication | undefined> {
    const [application] = await db.select().from(grantApplications).where(eq(grantApplications.id, id));
    return application;
  }

  async updateGrantApplication(id: string, updates: Partial<Pick<GrantApplication, 'status' | 'lastAdminViewedAt'>>): Promise<GrantApplication> {
    const [application] = await db.update(grantApplications).set(updates).where(eq(grantApplications.id, id)).returning();
    
    if (!application) {
      throw new Error(`Grant application with id ${id} not found`);
    }
    return application;
  }

  // Chat messages
  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db.insert(chatMessages).values(insertMessage).returning();
    return message;
  }

  async getChatMessagesByApplicationId(applicationId: string): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages)
      .where(eq(chatMessages.applicationId, applicationId))
      .orderBy(chatMessages.createdAt);
  }

  async getChatMessagesByToken(publicChatToken: string): Promise<ChatMessage[]> {
    // Join with grant applications to get messages by public token
    const messages = await db.select({
      id: chatMessages.id,
      applicationId: chatMessages.applicationId,
      senderRole: chatMessages.senderRole,
      senderId: chatMessages.senderId,
      body: chatMessages.body,
      createdAt: chatMessages.createdAt,
    })
    .from(chatMessages)
    .innerJoin(grantApplications, eq(chatMessages.applicationId, grantApplications.id))
    .where(eq(grantApplications.publicChatToken, publicChatToken))
    .orderBy(chatMessages.createdAt);
    
    return messages;
  }

  async updateChatMessage(id: string, updates: Pick<ChatMessage, 'body'>): Promise<ChatMessage> {
    const [message] = await db.update(chatMessages).set(updates).where(eq(chatMessages.id, id)).returning();
    
    if (!message) {
      throw new Error(`Chat message with id ${id} not found`);
    }
    return message;
  }

  async deleteChatMessage(id: string): Promise<void> {
    const deletedMessages = await db.delete(chatMessages).where(eq(chatMessages.id, id)).returning();
    
    if (deletedMessages.length === 0) {
      throw new Error(`Chat message with id ${id} not found`);
    }
  }

  async getUnreadMessageCount(applicationId: string): Promise<number> {
    const application = await this.getGrantApplicationById(applicationId);
    if (!application) {
        return 0;
    }

    // Get all applicant messages for this application first
    const allMessages = await db.select({
      id: chatMessages.id,
      createdAt: chatMessages.createdAt,
      senderRole: chatMessages.senderRole
    })
    .from(chatMessages)
    .where(and(
      eq(chatMessages.applicationId, applicationId),
      eq(chatMessages.senderRole, 'applicant')
    ))
    .orderBy(chatMessages.createdAt);

    // Filter for messages after lastAdminViewedAt
    let unreadCount = 0;
    const cutoffTime = application.lastAdminViewedAt;
    
    if (!cutoffTime) {
      // If admin has never viewed, all applicant messages are unread
      unreadCount = allMessages.length;
    } else {
      // Count messages created after the last admin view time
      unreadCount = allMessages.filter(msg => 
        msg.createdAt > cutoffTime
      ).length;
    }


    return unreadCount;
  }

  async getUnreadMessageCounts(applicationIds: string[]): Promise<Map<string, number>> {
    if (applicationIds.length === 0) {
      return new Map();
    }

    const counts = new Map<string, number>();

    for (const applicationId of applicationIds) {
      const count = await this.getUnreadMessageCount(applicationId);
      counts.set(applicationId, count);
    }
    
    return counts;
  }

  // Grants
  async getGrants(): Promise<Grant[]> {
    return await db.select().from(grants);
  }

  async getGrantById(id: string): Promise<Grant | undefined> {
    const [grant] = await db.select().from(grants).where(eq(grants.id, id));
    return grant;
  }

  async createGrant(insertGrant: InsertGrant): Promise<Grant> {
    const [grant] = await db.insert(grants).values(insertGrant).returning();
    return grant;
  }

  async updateGrant(id: string, updateData: Partial<InsertGrant>): Promise<Grant> {
    const [grant] = await db.update(grants).set({
      ...updateData,
      updatedAt: new Date()
    }).where(eq(grants.id, id)).returning();
    
    if (!grant) {
      throw new Error(`Grant with id ${id} not found`);
    }
    return grant;
  }

  async deleteGrant(id: string): Promise<void> {
    const deletedGrants = await db.delete(grants).where(eq(grants.id, id)).returning();
    
    if (deletedGrants.length === 0) {
      throw new Error(`Grant with id ${id} not found`);
    }
  }

  // Grant categories
  async getGrantCategories(): Promise<GrantCategory[]> {
    return await db.select().from(grantCategories);
  }

  async createGrantCategory(insertCategory: InsertGrantCategory): Promise<GrantCategory> {
    const [category] = await db.insert(grantCategories).values(insertCategory).returning();
    return category;
  }
}

export const storage = new DatabaseStorage();
